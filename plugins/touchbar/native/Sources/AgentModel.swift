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
    private var stopped = false

    func start() {
        queue.async { [weak self] in
            while let self, !self.isStopped {
                self.publish(Self.fetch())
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

    private static func fetch() -> AgentSnapshot {
        guard let data = BBCommand.run(["touchbar", "snapshot"]) else {
            NativeLog.debug("snapshot command returned no data")
            return AgentSnapshot(agents: [], connected: false)
        }
        guard data.count <= 65_536 else {
            NativeLog.error("snapshot output too large")
            return AgentSnapshot(agents: [], connected: false)
        }
        guard let payload = try? JSONDecoder().decode(BBSnapshot.self, from: data) else {
            NativeLog.error("snapshot JSON could not be decoded (\(data.count) bytes)")
            return AgentSnapshot(agents: [], connected: false)
        }
        guard payload.schemaVersion == 1 else {
            NativeLog.error("unsupported snapshot schema \(payload.schemaVersion)")
            return AgentSnapshot(agents: [], connected: false)
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
            NSWorkspace.shared.runningApplications
                .first(where: { $0.bundleIdentifier == "app.getbb.bb" })?
                .activate(options: [.activateAllWindows])
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
