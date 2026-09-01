import AppKit

enum AgentStatus: String, Decodable {
    case blocked, working, done, idle, waiting, unknown

    var isBusy: Bool { self == .working }
}

struct AgentEntry: Equatable {
    let id: String
    let title: String
    let provider: String
    let project: String
    let status: AgentStatus
}

struct AgentSnapshot: Equatable {
    var agents: [AgentEntry] = []
    var connected = false

    var working: Int { agents.filter { $0.status == .working }.count }
    var blocked: Int { agents.filter { $0.status == .blocked }.count }
    var done: Int { agents.filter { $0.status == .done }.count }
}

private struct BBSnapshot: Decodable {
    struct Summary: Decodable {
        let active: Int
        let attention: Int
        let visible: Int
    }

    struct Thread: Decodable {
        let id: String
        let title: String
        let status: String
        let providerId: String
        let project: String
        let unread: Bool
        let attention: String?
    }

    let schemaVersion: Int
    let summary: Summary
    let threads: [Thread]
}

final class AgentStore {
    var onChange: ((AgentSnapshot) -> Void)?
    private(set) var snapshot = AgentSnapshot()

    private let queue = DispatchQueue(label: "app.getbb.touchbar.store", qos: .utility)
    private let lock = NSLock()
    private var lastGoodSnapshot = AgentSnapshot()
    private var consecutiveFailures = 0
    private var stopped = false
    private static let offlineFailureThreshold = 3

    func start() {
        queue.async { [weak self] in
            while let self, !self.isStopped {
                if let next = Self.fetch() {
                    self.consecutiveFailures = 0
                    self.lastGoodSnapshot = next
                    self.publish(next)
                } else {
                    self.consecutiveFailures += 1
                    if self.consecutiveFailures == Self.offlineFailureThreshold {
                        var stale = self.lastGoodSnapshot
                        stale.connected = false
                        self.publish(stale)
                    }
                }
                for _ in 0..<20 where !self.isStopped {
                    Thread.sleep(forTimeInterval: 0.1)
                }
            }
        }
    }

    func stop() {
        lock.lock()
        stopped = true
        lock.unlock()
    }

    private var isStopped: Bool {
        lock.lock()
        defer { lock.unlock() }
        return stopped
    }

    private func publish(_ next: AgentSnapshot) {
        DispatchQueue.main.async { [weak self] in
            guard let self, next != self.snapshot else { return }
            self.snapshot = next
            self.onChange?(next)
        }
    }

    private static func fetch() -> AgentSnapshot? {
        guard let data = BBCommand.run(["touchbar", "snapshot"], timeout: 5) else {
            NativeLog.debug("snapshot command returned no data")
            return nil
        }
        guard data.count <= 65_536 else {
            NativeLog.error("snapshot output too large")
            return nil
        }
        guard let payload = try? JSONDecoder().decode(BBSnapshot.self, from: data) else {
            NativeLog.error("snapshot JSON could not be decoded (\(data.count) bytes)")
            return nil
        }
        guard payload.schemaVersion == 1 else {
            NativeLog.error("unsupported snapshot schema \(payload.schemaVersion)")
            return nil
        }

        let entries = payload.threads.map { thread in
            AgentEntry(
                id: thread.id,
                title: thread.title,
                provider: thread.providerId,
                project: thread.project,
                status: status(for: thread)
            )
        }
        return AgentSnapshot(agents: entries, connected: true)
    }

    private static func status(for thread: BBSnapshot.Thread) -> AgentStatus {
        if thread.attention == "input" || thread.status == "error" { return .blocked }
        if thread.status == "active" || thread.status == "stopping" { return .working }
        if thread.status == "waiting" { return .waiting }
        if thread.unread || thread.attention == "unread" { return .done }
        if thread.status == "idle" { return .idle }
        return .unknown
    }

    static func focus(_ entry: AgentEntry) {
        DispatchQueue.global(qos: .userInitiated).async {
            _ = BBCommand.run(["touchbar", "open", entry.id])
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.15) {
                activateBB()
            }
        }
    }

    private static func activateBB() {
        let workspace = NSWorkspace.shared
        if let app = workspace.runningApplications.first(where: {
            $0.bundleIdentifier == "dev.bb.desktop" ||
                $0.localizedName?.caseInsensitiveCompare("bb") == .orderedSame
        }) {
            app.activate(options: [.activateAllWindows])
            NativeLog.info("activated BB for selected thread")
            return
        }
        guard let url = workspace.urlForApplication(
            withBundleIdentifier: "dev.bb.desktop"
        ) else {
            NativeLog.error("BB desktop application was not found")
            return
        }
        let configuration = NSWorkspace.OpenConfiguration()
        configuration.activates = true
        workspace.openApplication(at: url, configuration: configuration) {
            _, error in
            if let error {
                NativeLog.error("could not activate BB: \(error.localizedDescription)")
            }
        }
    }
}

enum BBCommand {
    static func run(_ arguments: [String], timeout: TimeInterval = 1.5) -> Data? {
        guard let executable = NativeConfig.bbExecutable else { return nil }
        let process = Process()
        let output = Pipe()
        process.executableURL = URL(fileURLWithPath: executable)
        process.arguments = arguments
        var environment = ProcessInfo.processInfo.environment
        let fnmNodeBin = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent(".local/share/fnm/node-versions/v22.22.0/installation/bin").path
        environment["PATH"] = fnmNodeBin + ":/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:" + (environment["PATH"] ?? "")
        environment["HOME"] = FileManager.default.homeDirectoryForCurrentUser.path
        process.environment = environment
        process.standardOutput = output
        process.standardError = FileHandle.nullDevice

        do { try process.run() } catch {
            NativeLog.error("could not launch bb: \(error.localizedDescription)")
            return nil
        }
        let deadline = Date().addingTimeInterval(timeout)
        while process.isRunning && Date() < deadline {
            Thread.sleep(forTimeInterval: 0.04)
        }
        var timedOut = false
        if process.isRunning {
            NativeLog.error("bb snapshot timed out")
            timedOut = true
            process.terminate()
        }
        process.waitUntilExit()
        let data = output.fileHandleForReading.readDataToEndOfFile()
        guard process.terminationStatus == 0 else {
            // The BB CLI can leave a helper child alive after writing its JSON.
            // Preserve a complete snapshot even when the wrapper is terminated.
            if timedOut, !data.isEmpty { return data }
            NativeLog.error("bb exited with status \(process.terminationStatus)")
            return nil
        }
        return data
    }
}
