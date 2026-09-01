// BTT-Plugin-Name: BB Agent Monitor
// BTT-Plugin-Identifier: app.getbb.touchbar-agent-monitor
// BTT-Plugin-Type: TouchBar
// BTT-Plugin-Icon: terminal.fill

import Cocoa

private struct Snapshot: Decodable {
    struct Summary: Decodable {
        let active: Int
        let attention: Int
        let visible: Int
    }

    struct ThreadCard: Decodable {
        let id: String
        let title: String
        let status: String
        let providerId: String
        let project: String
        let attention: String?
    }

    let schemaVersion: Int
    let summary: Summary
    let threads: [ThreadCard]
}

private struct CardStyle {
    let accent: NSColor
    let badge: String
    let icon: String
    let badgeFill: NSColor
}

final class BBTouchBarMonitor: NSObject, BTTPluginInterface {
    weak var delegate: (any BTTTouchBarPluginDelegate)?
    private lazy var strip = BBStripButton(frame: NSRect(x: 0, y: 0, width: 910, height: 30))

    class func configurationFormItems() -> BTTPluginFormItem? { nil }
    func touchBarTitleString() -> String? { nil }

    func touchBarButton() -> NSButton? {
        strip.start()
        return strip
    }

    func touchBarViewController() -> NSViewController? { nil }
    func didReceiveNewConfigurationValues(_ configurationValues: [AnyHashable: Any]) {}

    deinit {
        strip.stop()
    }
}

private final class AgentCardView: NSView {
    private let iconView = NSImageView()
    private let titleField = NSTextField(labelWithString: "")
    private let detailField = NSTextField(labelWithString: "")
    private let badgeField = NSTextField(labelWithString: "")
    private let accentLayer = CALayer()

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        wantsLayer = true
        layer?.cornerRadius = 5
        layer?.borderWidth = 1
        layer?.borderColor = NSColor(calibratedWhite: 0.88, alpha: 0.78).cgColor
        layer?.backgroundColor = NSColor(calibratedWhite: 0.055, alpha: 0.96).cgColor
        layer?.masksToBounds = true

        iconView.imageScaling = .scaleProportionallyDown
        iconView.contentTintColor = NSColor(calibratedWhite: 0.96, alpha: 1)

        titleField.font = .monospacedSystemFont(ofSize: 9.5, weight: .semibold)
        titleField.textColor = NSColor(calibratedWhite: 0.96, alpha: 1)
        titleField.lineBreakMode = .byTruncatingTail
        titleField.maximumNumberOfLines = 1

        detailField.font = .monospacedSystemFont(ofSize: 6.8, weight: .medium)
        detailField.textColor = NSColor(calibratedWhite: 0.66, alpha: 1)
        detailField.lineBreakMode = .byTruncatingTail
        detailField.maximumNumberOfLines = 1

        badgeField.font = .monospacedSystemFont(ofSize: 6.3, weight: .bold)
        badgeField.alignment = .center
        badgeField.textColor = .white
        badgeField.wantsLayer = true
        badgeField.layer?.cornerRadius = 4
        badgeField.layer?.masksToBounds = true

        accentLayer.cornerRadius = 1
        layer?.addSublayer(accentLayer)
        addSubview(iconView)
        addSubview(titleField)
        addSubview(detailField)
        addSubview(badgeField)
    }

    required init?(coder: NSCoder) { nil }

    override func layout() {
        super.layout()
        let badgeWidth: CGFloat = badgeField.stringValue.isEmpty ? 0 : 38
        let textX: CGFloat = 31
        iconView.frame = NSRect(x: 7, y: 6, width: 18, height: 18)
        badgeField.frame = NSRect(
            x: bounds.width - badgeWidth - 6,
            y: 16,
            width: badgeWidth,
            height: 9
        )
        titleField.frame = NSRect(
            x: textX,
            y: 14,
            width: max(20, bounds.width - textX - badgeWidth - 10),
            height: 12
        )
        detailField.frame = NSRect(
            x: textX,
            y: 3,
            width: max(20, bounds.width - textX - 8),
            height: 10
        )
        accentLayer.frame = CGRect(x: 0, y: 0, width: bounds.width, height: 2)
    }

    func apply(title: String, detail: String, style: CardStyle) {
        titleField.stringValue = title
        detailField.stringValue = detail
        badgeField.stringValue = style.badge
        badgeField.layer?.backgroundColor = style.badgeFill.cgColor
        iconView.image = NSImage(systemSymbolName: style.icon, accessibilityDescription: nil)
        iconView.contentTintColor = style.accent
        accentLayer.backgroundColor = style.accent.cgColor
        layer?.borderColor = style.accent.withAlphaComponent(0.74).cgColor
        needsLayout = true
    }
}

private final class BBStripButton: NSButton {
    private let summaryCard = AgentCardView(frame: .zero)
    private let threadCards = (0..<3).map { _ in AgentCardView(frame: .zero) }
    private var threadIds: [String?] = [nil, nil, nil]
    private var timer: Timer?
    private var refreshInFlight = false
    private var bbExecutable: String?

    override init(frame frameRect: NSRect) {
        super.init(frame: frameRect)
        title = ""
        isBordered = false
        wantsLayer = true
        layer?.backgroundColor = NSColor.black.cgColor
        addSubview(summaryCard)
        for card in threadCards {
            card.isHidden = true
            addSubview(card)
        }
        setAccessibilityLabel("BB Agent Monitor")
        showConnecting()
    }

    required init?(coder: NSCoder) { nil }

    override var intrinsicContentSize: NSSize {
        NSSize(width: 910, height: 30)
    }

    override func layout() {
        super.layout()
        summaryCard.frame = NSRect(x: 2, y: 1, width: 194, height: 28)
        for (index, card) in threadCards.enumerated() {
            card.frame = NSRect(x: 200 + CGFloat(index) * 236, y: 1, width: 232, height: 28)
        }
    }

    override func mouseDown(with event: NSEvent) {
        let point = convert(event.locationInWindow, from: nil)
        if summaryCard.frame.contains(point), let first = threadIds.compactMap({ $0 }).first {
            openThread(first)
        } else {
            for (index, card) in threadCards.enumerated()
                where !card.isHidden && card.frame.contains(point) {
                if let threadId = threadIds[index] { openThread(threadId) }
                break
            }
        }
        super.mouseDown(with: event)
    }

    func start() {
        guard timer == nil else { return }
        refresh()
        timer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in
            self?.refresh()
        }
    }

    func stop() {
        timer?.invalidate()
        timer = nil
    }

    private func resolveBBExecutable() -> String? {
        if let cached = bbExecutable,
           FileManager.default.isExecutableFile(atPath: cached) {
            return cached
        }

        let environment = ProcessInfo.processInfo.environment
        var candidates: [String] = []
        if let explicit = environment["BB_TOUCHBAR_BB_BIN"] {
            candidates.append(explicit)
        }
        let configuredPath = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/Application Support/BBTouchBar/bb-path")
        if let configured = try? String(contentsOf: configuredPath, encoding: .utf8)
            .trimmingCharacters(in: .whitespacesAndNewlines),
           !configured.isEmpty {
            candidates.append(configured)
        }
        candidates.append(contentsOf: ["/usr/local/bin/bb", "/opt/homebrew/bin/bb"])
        if let path = environment["PATH"] {
            candidates.append(contentsOf: path.split(separator: ":").map { "\($0)/bb" })
        }
        bbExecutable = candidates.first { FileManager.default.isExecutableFile(atPath: $0) }
        return bbExecutable
    }

    private func refresh() {
        guard !refreshInFlight, let executable = resolveBBExecutable() else {
            showOffline()
            return
        }
        refreshInFlight = true
        run(executable: executable, arguments: ["touchbar", "snapshot"]) { [weak self] data in
            guard let self else { return }
            self.refreshInFlight = false
            guard
                let data,
                data.count <= 65_536,
                let snapshot = try? JSONDecoder().decode(Snapshot.self, from: data),
                snapshot.schemaVersion == 1
            else {
                self.showOffline()
                return
            }
            self.apply(snapshot)
        }
    }

    private func run(
        executable: String,
        arguments: [String],
        completion: @escaping (Data?) -> Void
    ) {
        DispatchQueue.global(qos: .utility).async {
            let process = Process()
            let output = Pipe()
            process.executableURL = URL(fileURLWithPath: executable)
            process.arguments = arguments
            process.standardOutput = output
            process.standardError = FileHandle.nullDevice
            do {
                try process.run()
            } catch {
                DispatchQueue.main.async { completion(nil) }
                return
            }
            let deadline = Date().addingTimeInterval(1.5)
            while process.isRunning && Date() < deadline {
                Thread.sleep(forTimeInterval: 0.04)
            }
            if process.isRunning { process.terminate() }
            process.waitUntilExit()
            let data = process.terminationStatus == 0
                ? output.fileHandleForReading.readDataToEndOfFile()
                : nil
            DispatchQueue.main.async { completion(data) }
        }
    }

    private func style(for thread: Snapshot.ThreadCard) -> CardStyle {
        if thread.attention == "input" {
            return CardStyle(accent: .systemOrange, badge: "INPUT", icon: "person.crop.circle.badge.exclamationmark", badgeFill: .systemOrange)
        }
        switch thread.status {
        case "active":
            return CardStyle(accent: .systemCyan, badge: "RUN", icon: "bolt.fill", badgeFill: .systemBlue)
        case "error":
            return CardStyle(accent: .systemRed, badge: "ERR", icon: "exclamationmark.triangle.fill", badgeFill: .systemRed)
        case "waiting":
            return CardStyle(accent: .systemPurple, badge: "WAIT", icon: "wifi.exclamationmark", badgeFill: .systemPurple)
        case "stopping":
            return CardStyle(accent: .systemYellow, badge: "STOP", icon: "stop.circle.fill", badgeFill: .systemOrange)
        default:
            return CardStyle(
                accent: NSColor(calibratedWhite: 0.72, alpha: 1),
                badge: thread.attention == "unread" ? "NEW" : "IDLE",
                icon: "terminal.fill",
                badgeFill: thread.attention == "unread" ? .systemIndigo : .darkGray
            )
        }
    }

    private func apply(_ snapshot: Snapshot) {
        let summaryStyle = CardStyle(
            accent: snapshot.summary.attention > 0 ? .systemOrange : .systemBlue,
            badge: snapshot.summary.attention > 0 ? "CHECK" : "LIVE",
            icon: "waveform.path.ecg",
            badgeFill: snapshot.summary.attention > 0 ? .systemOrange : .systemBlue
        )
        let summaryDetail = snapshot.summary.attention > 0
            ? "\(snapshot.summary.active) ACTIVE · \(snapshot.summary.attention) NEED YOU"
            : "\(snapshot.summary.active) ACTIVE · \(snapshot.summary.visible) THREADS"
        summaryCard.apply(title: "BB Agent Monitor", detail: summaryDetail, style: summaryStyle)

        for (index, card) in threadCards.enumerated() {
            guard index < snapshot.threads.count else {
                card.isHidden = true
                threadIds[index] = nil
                continue
            }
            let thread = snapshot.threads[index]
            card.apply(
                title: thread.title,
                detail: "\(thread.providerId.uppercased()) · \(thread.project)",
                style: style(for: thread)
            )
            threadIds[index] = thread.id
            card.isHidden = false
        }
        setAccessibilityLabel("BB Agent Monitor, \(summaryDetail)")
        needsLayout = true
    }

    private func showConnecting() {
        summaryCard.apply(
            title: "BB Agent Monitor",
            detail: "CONNECTING TO BB",
            style: CardStyle(accent: .systemBlue, badge: "…", icon: "waveform.path.ecg", badgeFill: .systemBlue)
        )
    }

    private func showOffline() {
        summaryCard.apply(
            title: "BB Agent Monitor",
            detail: "BB OFFLINE · TAP TO RETRY",
            style: CardStyle(accent: .systemRed, badge: "OFF", icon: "exclamationmark.triangle.fill", badgeFill: .systemRed)
        )
        for (index, card) in threadCards.enumerated() {
            card.isHidden = true
            threadIds[index] = nil
        }
    }

    private func openThread(_ threadId: String) {
        guard let executable = resolveBBExecutable() else { return }
        run(executable: executable, arguments: ["touchbar", "open", threadId]) { _ in }
    }
}
