import AppKit

extension NSTouchBarItem.Identifier {
    static let bbStrip = NSTouchBarItem.Identifier("app.getbb.touchbar.strip")
    static let bbList = NSTouchBarItem.Identifier("app.getbb.touchbar.list")
    static let bbSettings = NSTouchBarItem.Identifier("app.getbb.touchbar.settings")
    static let bbPriority = NSTouchBarItem.Identifier("app.getbb.touchbar.priority")
    static let bbProject = NSTouchBarItem.Identifier("app.getbb.touchbar.project")
    static let bbDock = NSTouchBarItem.Identifier("app.getbb.touchbar.dock")
    static let bbCarousel = NSTouchBarItem.Identifier("app.getbb.touchbar.carousel")
    static let bbPreviousProject = NSTouchBarItem.Identifier("app.getbb.touchbar.previous-project")
    static let bbNextProject = NSTouchBarItem.Identifier("app.getbb.touchbar.next-project")
    static let bbUsage = NSTouchBarItem.Identifier("app.getbb.touchbar.usage")
    static let bbHostMonitor = NSTouchBarItem.Identifier("app.getbb.touchbar.host-monitor")
    static let bbUsageToggle = NSTouchBarItem.Identifier("app.getbb.touchbar.usage-toggle")
    static let bbHostToggle = NSTouchBarItem.Identifier("app.getbb.touchbar.host-toggle")
    static let bbCodexToggle = NSTouchBarItem.Identifier("app.getbb.touchbar.codex-toggle")
    static let bbClaudeToggle = NSTouchBarItem.Identifier("app.getbb.touchbar.claude-toggle")
    static let bbCursorToggle = NSTouchBarItem.Identifier("app.getbb.touchbar.cursor-toggle")
    static let bbClose = NSTouchBarItem.Identifier("app.getbb.touchbar.close")
}

private enum SortMode: String {
    case status
    case project
    case dock
    case carousel
}

private enum StatusPalette {
    static func bezel(for status: AgentStatus) -> NSColor {
        switch status {
        case .blocked: return .systemRed
        case .working: return .systemBlue
        case .done: return .systemGreen
        case .waiting: return .systemPurple
        case .idle: return NSColor(white: 0.20, alpha: 1)
        case .unknown: return NSColor(white: 0.14, alpha: 1)
        }
    }

    static func badge(for status: AgentStatus) -> String {
        switch status {
        case .blocked: return "INPUT"
        case .working: return "RUN"
        case .done: return "UNREAD"
        case .waiting: return "WAIT"
        case .idle: return "IDLE"
        case .unknown: return "?"
        }
    }

    static func section(for status: AgentStatus) -> String {
        switch status {
        case .blocked: return "NEEDS YOU"
        case .working: return "ACTIVE"
        case .waiting: return "WAITING"
        case .done: return "UNREAD"
        case .idle: return "IDLE"
        case .unknown: return "OTHER"
        }
    }
}

private final class ProjectInitialBadge: NSView {
    private let initial: String
    private let color: NSColor

    init(initial: String, color: NSColor) {
        self.initial = initial
        self.color = color
        super.init(frame: .zero)
        wantsLayer = true
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)
        color.setFill()
        NSBezierPath(roundedRect: bounds, xRadius: 5, yRadius: 5).fill()
        let attributes: [NSAttributedString.Key: Any] = [
            .font: NSFont.monospacedSystemFont(ofSize: 10, weight: .bold),
            .foregroundColor: NSColor.white,
        ]
        let text = initial as NSString
        let size = text.size(withAttributes: attributes)
        text.draw(
            at: NSPoint(
                x: floor((bounds.width - size.width) / 2),
                y: floor((bounds.height - size.height) / 2)
            ),
            withAttributes: attributes
        )
    }
}

private final class GroupDividerView: NSButton {
    private let statusLabel = NSTextField(labelWithString: "")
    private let projectLabel = NSTextField(labelWithString: "")
    private let compactProject: Bool
    private let compactWidth: CGFloat
    private var projectBadge: ProjectInitialBadge?

    init(
        status: AgentStatus,
        project: String,
        count: Int,
        projectFirst: Bool,
        threadId: String,
        target: AnyObject?,
        action: Selector?
    ) {
        compactProject = projectFirst
        compactWidth = projectFirst
            ? 32
            : 96
        super.init(frame: .zero)
        self.target = target
        self.action = action
        identifier = NSUserInterfaceItemIdentifier(threadId)
        title = ""
        isBordered = false
        let color = projectFirst ? Self.projectColor(project) : StatusPalette.bezel(for: status)
        wantsLayer = true
        layer?.cornerRadius = 5
        layer?.backgroundColor = projectFirst
            ? NSColor.clear.cgColor
            : NSColor(white: 0.08, alpha: 0.98).cgColor
        layer?.borderWidth = projectFirst ? 0 : 1
        layer?.borderColor = color.withAlphaComponent(0.7).cgColor

        statusLabel.stringValue = projectFirst ? "" : StatusPalette.section(for: status)
        statusLabel.font = .monospacedSystemFont(ofSize: 6.5, weight: .bold)
        statusLabel.alignment = .left
        statusLabel.textColor = color
        statusLabel.lineBreakMode = .byTruncatingTail
        projectLabel.stringValue = projectFirst
            ? ""
            : "\(project.uppercased()) · \(count)"
        projectLabel.font = .monospacedSystemFont(
            ofSize: projectFirst ? 7.2 : 7.5,
            weight: .bold
        )
        projectLabel.alignment = .left
        projectLabel.textColor = .white
        projectLabel.lineBreakMode = .byTruncatingTail
        addSubview(statusLabel)
        addSubview(projectLabel)
        if projectFirst {
            let badge = ProjectInitialBadge(
                initial: Self.projectInitials(project),
                color: color
            )
            projectBadge = badge
            addSubview(badge)
        }
        let section = projectFirst ? "Project" : StatusPalette.section(for: status)
        setAccessibilityLabel("\(section), \(project), \(count) threads")
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize {
        NSSize(width: compactWidth, height: 30)
    }

    override func layout() {
        super.layout()
        if compactProject {
            statusLabel.frame = .zero
            projectBadge?.frame = NSRect(x: 5, y: 4, width: 22, height: 22)
            projectLabel.frame = .zero
        } else {
            statusLabel.frame = NSRect(x: 7, y: 16, width: bounds.width - 14, height: 9)
            projectLabel.frame = NSRect(x: 7, y: 4, width: bounds.width - 14, height: 10)
        }
    }

    override func hitTest(_ point: NSPoint) -> NSView? {
        bounds.contains(point) ? self : nil
    }

    override func mouseDown(with event: NSEvent) {
        guard isEnabled, let action else { return }
        NSApp.sendAction(action, to: target, from: self)
    }

    func setSelected(_ selected: Bool) {
        guard compactProject else { return }
        layer?.borderWidth = selected ? 2 : 0
        layer?.borderColor = selected ? NSColor.white.cgColor : NSColor.clear.cgColor
    }

    private static func projectInitials(_ project: String) -> String {
        guard let token = project.split(whereSeparator: {
            !$0.isLetter && !$0.isNumber
        }).first else { return "?" }
        if token.count <= 2 { return token.uppercased() }
        return String(token.prefix(1)).uppercased()
    }

    static func projectColor(_ project: String) -> NSColor {
        let palette: [NSColor] = [
            .systemBlue, .systemPurple, .systemPink, .systemOrange,
            .systemGreen, .systemTeal, .systemIndigo, .systemRed,
        ]
        var hash: UInt64 = 0xcbf29ce484222325
        for byte in project.lowercased().utf8 {
            hash ^= UInt64(byte)
            hash &*= 0x100000001b3
        }
        return palette[Int(hash % UInt64(palette.count))]
    }
}

private final class ProjectGroupView: NSView {
    private let stack: NSStackView
    private let measuredWidth: CGFloat

    init(views: [NSView]) {
        let nestedStack = NSStackView(views: views)
        nestedStack.orientation = .horizontal
        nestedStack.spacing = 4
        nestedStack.alignment = .centerY
        stack = nestedStack
        measuredWidth = nestedStack.fittingSize.width + 8
        super.init(frame: .zero)
        wantsLayer = true
        layer?.cornerRadius = 6
        layer?.borderWidth = 1
        layer?.borderColor = NSColor(white: 0.28, alpha: 0.9).cgColor
        layer?.backgroundColor = NSColor(white: 0.035, alpha: 0.98).cgColor
        layer?.masksToBounds = true
        addSubview(stack)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize {
        NSSize(width: measuredWidth, height: 30)
    }

    override func layout() {
        super.layout()
        stack.frame = NSRect(x: 4, y: 0, width: bounds.width - 8, height: 30)
    }
}

private final class HostMetricTile: NSView {
    private let titleLabel = NSTextField(labelWithString: "")
    private let valueLabel = NSTextField(labelWithString: "")
    private let fixedWidth: CGFloat

    init(title: String, value: String, color: NSColor, width: CGFloat) {
        fixedWidth = width
        super.init(frame: .zero)
        wantsLayer = true
        layer?.cornerRadius = 5
        layer?.borderWidth = 1
        layer?.borderColor = color.withAlphaComponent(0.55).cgColor
        layer?.backgroundColor = color.withAlphaComponent(0.14).cgColor
        titleLabel.stringValue = title
        titleLabel.font = .monospacedSystemFont(ofSize: 5.5, weight: .bold)
        titleLabel.textColor = color
        titleLabel.alignment = .center
        valueLabel.stringValue = value
        valueLabel.font = .monospacedDigitSystemFont(ofSize: 8, weight: .semibold)
        valueLabel.textColor = .white
        valueLabel.alignment = .center
        addSubview(titleLabel)
        addSubview(valueLabel)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize { NSSize(width: fixedWidth, height: 26) }

    override func layout() {
        super.layout()
        titleLabel.frame = NSRect(x: 2, y: 15, width: bounds.width - 4, height: 7)
        valueLabel.frame = NSRect(x: 2, y: 4, width: bounds.width - 4, height: 10)
    }
}

private final class HostMetricView: NSView {
    private let iconView = NSImageView()
    private let stateLabel = NSTextField(labelWithString: "")
    private let nameLabel = NSTextField(labelWithString: "")
    private let tiles: [HostMetricTile]
    private let measuredWidth: CGFloat

    init(entry: HostMetricEntry) {
        let connected = entry.status == "connected"
        let cpu = HostMetricTile(
            title: "CPU",
            value: Self.percent(entry.cpuPercent),
            color: Self.resourceColor(entry.cpuPercent, connected: connected),
            width: 42
        )
        let memory = HostMetricTile(
            title: "RAM",
            value: Self.percent(entry.memoryPercent),
            color: Self.resourceColor(entry.memoryPercent, connected: connected),
            width: 42
        )
        let disk = HostMetricTile(
            title: "DISK",
            value: Self.percent(entry.diskPercent),
            color: Self.resourceColor(entry.diskPercent, connected: connected),
            width: 42
        )
        let download = HostMetricTile(
            title: "DOWN",
            value: Self.rate(entry.receiveBytesPerSecond),
            color: connected ? .systemRed : NSColor(white: 0.4, alpha: 1),
            width: 52
        )
        let upload = HostMetricTile(
            title: "UP",
            value: Self.rate(entry.sendBytesPerSecond),
            color: connected ? .systemBlue : NSColor(white: 0.4, alpha: 1),
            width: 52
        )
        tiles = [cpu, memory, disk, download, upload]
        measuredWidth = 105 + tiles.reduce(CGFloat(0)) {
            $0 + $1.intrinsicContentSize.width
        } + CGFloat((tiles.count - 1) * 3) + 5
        super.init(frame: .zero)
        wantsLayer = true
        layer?.cornerRadius = 7
        layer?.borderWidth = 1
        layer?.borderColor = Self.overallColor(entry).withAlphaComponent(0.75).cgColor
        layer?.backgroundColor = NSColor(white: 0.035, alpha: 0.98).cgColor
        layer?.masksToBounds = true

        iconView.image = NSImage(
            systemSymbolName: "desktopcomputer",
            accessibilityDescription: "Host"
        )
        iconView.contentTintColor = connected ? .systemGreen : .systemRed
        iconView.imageScaling = .scaleProportionallyDown
        stateLabel.stringValue = connected ? "LIVE" : "OFFLINE"
        stateLabel.font = .monospacedSystemFont(ofSize: 5.5, weight: .bold)
        stateLabel.textColor = connected ? .systemGreen : .systemRed
        nameLabel.stringValue = entry.name
        nameLabel.font = .monospacedSystemFont(ofSize: 7, weight: .bold)
        nameLabel.textColor = .white
        nameLabel.lineBreakMode = .byTruncatingTail
        addSubview(iconView)
        addSubview(stateLabel)
        addSubview(nameLabel)
        for tile in tiles { addSubview(tile) }
        setAccessibilityLabel("\(entry.name), \(Self.accessibleMetrics(entry))")
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize { NSSize(width: measuredWidth, height: 30) }

    override func layout() {
        super.layout()
        iconView.frame = NSRect(x: 6, y: 8, width: 15, height: 15)
        stateLabel.frame = NSRect(x: 25, y: 17, width: 73, height: 7)
        nameLabel.frame = NSRect(x: 25, y: 5, width: 73, height: 10)
        var x: CGFloat = 104
        for tile in tiles {
            let width = tile.intrinsicContentSize.width
            tile.frame = NSRect(x: x, y: 2, width: width, height: 26)
            x += width + 3
        }
    }

    private static func percent(_ value: Double?) -> String {
        value.map { "\(Int($0.rounded()))%" } ?? "—"
    }

    private static func rate(_ value: Double?) -> String {
        guard var current = value else { return "—" }
        let units = ["B/s", "K/s", "M/s", "G/s"]
        var index = 0
        while current >= 1_024, index < units.count - 1 {
            current /= 1_024
            index += 1
        }
        return current >= 10
            ? "\(Int(current.rounded()))\(units[index])"
            : String(format: "%.1f%@", current, units[index])
    }

    private static func resourceColor(_ value: Double?, connected: Bool) -> NSColor {
        guard connected, let value else { return NSColor(white: 0.4, alpha: 1) }
        if value >= 95 { return .systemRed }
        if value >= 85 { return .systemOrange }
        return .systemGreen
    }

    private static func overallColor(_ entry: HostMetricEntry) -> NSColor {
        guard entry.status == "connected" else { return .systemRed }
        let peak = [entry.cpuPercent, entry.memoryPercent, entry.diskPercent]
            .compactMap { $0 }
            .max() ?? 0
        return resourceColor(peak, connected: true)
    }

    private static func accessibleMetrics(_ entry: HostMetricEntry) -> String {
        guard entry.status == "connected" else { return "offline" }
        return "CPU \(percent(entry.cpuPercent)), RAM \(percent(entry.memoryPercent)), disk \(percent(entry.diskPercent)), download \(rate(entry.receiveBytesPerSecond)), upload \(rate(entry.sendBytesPerSecond))"
    }
}

private final class UsageIconStripView: NSView {
    private struct Item {
        let id: String
        let name: String
        let percent: Double?
    }

    private var items: [Item] = []

    override var intrinsicContentSize: NSSize {
        NSSize(width: CGFloat(max(items.count, 1) * 28), height: 30)
    }

    func update(entries: [UsageEntry], visibility: [String: Bool]) {
        items = entries.compactMap { entry in
            guard visibility[entry.id] == true else { return nil }
            return Item(id: entry.id, name: entry.name, percent: entry.usedPercent)
        }
        let accessible = items.map { item in
            item.percent.map { "\(item.name) \(Int($0.rounded())) percent used" }
                ?? "\(item.name) unavailable"
        }.joined(separator: ", ")
        setAccessibilityLabel(accessible.isEmpty ? "Subscription usage hidden" : accessible)
        invalidateIntrinsicContentSize()
        frame.size = intrinsicContentSize
        needsDisplay = true
    }

    override func draw(_ dirtyRect: NSRect) {
        super.draw(dirtyRect)
        if items.isEmpty {
            NSColor(white: 0.35, alpha: 1).setStroke()
            let path = NSBezierPath(ovalIn: NSRect(x: 6, y: 6, width: 18, height: 18))
            path.lineWidth = 2
            path.stroke()
            return
        }
        for (index, item) in items.enumerated() {
            let origin = CGFloat(index * 28)
            let ringRect = NSRect(x: origin + 3, y: 3, width: 24, height: 24)
            NSColor(white: 0.25, alpha: 1).setStroke()
            let background = NSBezierPath(ovalIn: ringRect)
            background.lineWidth = 2
            background.stroke()

            if let percent = item.percent {
                let clamped = min(100, max(0, percent))
                Self.color(for: clamped).setStroke()
                let progress = NSBezierPath()
                progress.appendArc(
                    withCenter: NSPoint(x: ringRect.midX, y: ringRect.midY),
                    radius: 12,
                    startAngle: 90,
                    endAngle: 90 - CGFloat(clamped * 3.6),
                    clockwise: true
                )
                progress.lineWidth = 2.5
                progress.lineCapStyle = .round
                progress.stroke()
            }

            let provider = item.id == "claudeCode" ? "claude-code" : item.id
            if item.id == "cursor" {
                NSColor.white.setFill()
                NSBezierPath(roundedRect: NSRect(x: origin + 8, y: 8, width: 14, height: 14), xRadius: 3, yRadius: 3).fill()
            }
            ProviderIcon.image(for: provider).draw(
                in: NSRect(x: origin + 8, y: 8, width: 14, height: 14),
                from: .zero,
                operation: .sourceOver,
                fraction: item.percent == nil ? 0.45 : 1
            )
        }
    }

    private static func color(for percent: Double) -> NSColor {
        if percent >= 90 { return .systemRed }
        if percent >= 75 { return .systemOrange }
        return .systemGreen
    }
}

private final class SettingsControlButton: NSButton {
    private let fixedWidth: CGFloat

    init(title: String, width: CGFloat) {
        fixedWidth = width
        super.init(frame: NSRect(x: 0, y: 0, width: width, height: 17))
        self.title = title
        isBordered = true
        bezelStyle = .texturedRounded
        refusesFirstResponder = true
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize { NSSize(width: fixedWidth, height: 17) }

    override func hitTest(_ point: NSPoint) -> NSView? {
        bounds.contains(point) ? self : nil
    }

    override func mouseDown(with event: NSEvent) {
        guard isEnabled, let action else { return }
        NSApp.sendAction(action, to: target, from: self)
    }
}

private final class SettingsGroupView: NSView {
    private let sectionLabel = NSTextField(labelWithString: "")
    private let controls: [SettingsControlButton]
    private let measuredWidth: CGFloat

    init(title: String, controls: [SettingsControlButton]) {
        self.controls = controls
        measuredWidth = controls.reduce(CGFloat(8)) { $0 + $1.intrinsicContentSize.width } +
            CGFloat(max(controls.count - 1, 0) * 3)
        super.init(frame: .zero)
        wantsLayer = true
        layer?.cornerRadius = 6
        layer?.borderWidth = 1
        layer?.borderColor = NSColor(white: 0.30, alpha: 0.9).cgColor
        layer?.backgroundColor = NSColor(white: 0.045, alpha: 0.98).cgColor
        sectionLabel.stringValue = title
        sectionLabel.font = .monospacedSystemFont(ofSize: 5.5, weight: .bold)
        sectionLabel.textColor = NSColor(white: 0.62, alpha: 1)
        addSubview(sectionLabel)
        for control in controls { addSubview(control) }
        setAccessibilityLabel("\(title) settings")
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize { NSSize(width: measuredWidth, height: 30) }

    override func layout() {
        super.layout()
        sectionLabel.frame = NSRect(x: 6, y: 20, width: bounds.width - 12, height: 7)
        var x: CGFloat = 4
        for control in controls {
            let width = control.intrinsicContentSize.width
            control.frame = NSRect(x: x, y: 1, width: width, height: 17)
            x += width + 3
        }
    }
}

private final class AgentButton: NSButton {
    private let iconView = NSImageView()
    private let titleLabel = NSTextField(labelWithString: "")
    private let badgeLabel = NSTextField(labelWithString: "")
    private let accentLayer = CALayer()
    private var badgeWidth: CGFloat = 30
    private var grouped = false

    init(target: AnyObject?, action: Selector?) {
        super.init(frame: .zero)
        self.target = target
        self.action = action
        title = ""
        isBordered = false
        wantsLayer = true
        layer?.cornerRadius = 5
        layer?.borderWidth = 1
        layer?.masksToBounds = true

        iconView.imageScaling = .scaleProportionallyDown
        iconView.imageFrameStyle = .none
        iconView.wantsLayer = true
        titleLabel.font = .monospacedSystemFont(ofSize: 9.5, weight: .semibold)
        titleLabel.lineBreakMode = .byTruncatingTail
        badgeLabel.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        badgeLabel.alignment = .center
        badgeLabel.textColor = .white
        badgeLabel.wantsLayer = true
        badgeLabel.layer?.cornerRadius = 4
        badgeLabel.layer?.masksToBounds = true

        accentLayer.cornerRadius = 1
        layer?.addSublayer(accentLayer)
        for view in [iconView, titleLabel, badgeLabel] { addSubview(view) }
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }

    override var intrinsicContentSize: NSSize { NSSize(width: 145, height: 30) }

    override func layout() {
        super.layout()
        iconView.frame = NSRect(x: 5, y: 4, width: 22, height: 22)
        badgeLabel.frame = NSRect(
            x: bounds.width - badgeWidth - 6,
            y: 10,
            width: badgeWidth,
            height: 10
        )
        titleLabel.frame = NSRect(
            x: 31,
            y: 8,
            width: bounds.width - badgeWidth - 43,
            height: 14
        )
        accentLayer.frame = CGRect(x: 0, y: 0, width: bounds.width, height: 2)
    }

    override func hitTest(_ point: NSPoint) -> NSView? {
        frame.contains(point) ? self : nil
    }

    func setGrouped(_ value: Bool) {
        grouped = value
        layer?.borderWidth = value ? 0 : 1
        accentLayer.isHidden = value
    }

    func update(entry: AgentEntry, primary: String) {
        let color = StatusPalette.bezel(for: entry.status)
        iconView.image = ProviderIcon.image(for: entry.provider)
        let provider = entry.provider.lowercased()
        let needsLightTile = provider == "cursor" || provider == "acp-cursor"
        iconView.layer?.cornerRadius = needsLightTile ? 4 : 0
        iconView.layer?.backgroundColor = needsLightTile
            ? NSColor.white.cgColor
            : NSColor.clear.cgColor
        titleLabel.stringValue = primary
        titleLabel.textColor = .white
        badgeWidth = entry.status == .done ? 40 : 30
        badgeLabel.stringValue = StatusPalette.badge(for: entry.status)
        badgeLabel.layer?.backgroundColor = color.withAlphaComponent(0.92).cgColor
        layer?.backgroundColor = NSColor(
            white: grouped ? 0.075 : 0.055,
            alpha: 0.96
        ).cgColor
        layer?.borderColor = grouped
            ? NSColor.clear.cgColor
            : color.withAlphaComponent(0.82).cgColor
        accentLayer.backgroundColor = color.cgColor
        setAccessibilityLabel("\(entry.title), \(entry.project), \(entry.status.rawValue)")
        needsLayout = true
    }
}

final class TouchBarController: NSObject, NSTouchBarDelegate {
    private let store = AgentStore()
    private let stripItem = NSCustomTouchBarItem(identifier: .bbStrip)
    private let stripButton = NSButton(title: "", target: nil, action: nil)
    private let panelItem = NSCustomTouchBarItem(identifier: .bbList)
    private let settingsItem = NSCustomTouchBarItem(identifier: .bbSettings)
    private let priorityItem = NSCustomTouchBarItem(identifier: .bbPriority)
    private let projectItem = NSCustomTouchBarItem(identifier: .bbProject)
    private let dockItem = NSCustomTouchBarItem(identifier: .bbDock)
    private let carouselItem = NSCustomTouchBarItem(identifier: .bbCarousel)
    private let previousProjectItem = NSCustomTouchBarItem(identifier: .bbPreviousProject)
    private let nextProjectItem = NSCustomTouchBarItem(identifier: .bbNextProject)
    private let usageItem = NSCustomTouchBarItem(identifier: .bbUsage)
    private let hostMonitorItem = NSCustomTouchBarItem(identifier: .bbHostMonitor)
    private let usageToggleItem = NSCustomTouchBarItem(identifier: .bbUsageToggle)
    private let hostToggleItem = NSCustomTouchBarItem(identifier: .bbHostToggle)
    private let codexToggleItem = NSCustomTouchBarItem(identifier: .bbCodexToggle)
    private let claudeToggleItem = NSCustomTouchBarItem(identifier: .bbClaudeToggle)
    private let cursorToggleItem = NSCustomTouchBarItem(identifier: .bbCursorToggle)
    private let closeItem = NSCustomTouchBarItem(identifier: .bbClose)
    private let settingsButton = NSButton(title: "", target: nil, action: nil)
    private let priorityButton = SettingsControlButton(title: "PRIORITY", width: 52)
    private let projectButton = SettingsControlButton(title: "PROJECT", width: 48)
    private let dockButton = SettingsControlButton(title: "DOCK", width: 36)
    private let carouselButton = SettingsControlButton(title: "CAROUSEL", width: 54)
    private let previousProjectButton = NSButton(title: "‹", target: nil, action: nil)
    private let nextProjectButton = NSButton(title: "›", target: nil, action: nil)
    private let usageIconsView = UsageIconStripView()
    private let hostMonitorButton = NSButton(title: "", target: nil, action: nil)
    private let usageToggleButton = SettingsControlButton(title: "SHOW", width: 38)
    private let hostToggleButton = SettingsControlButton(title: "SHOW", width: 38)
    private let codexToggleButton = SettingsControlButton(title: "", width: 25)
    private let claudeToggleButton = SettingsControlButton(title: "", width: 25)
    private let cursorToggleButton = SettingsControlButton(title: "", width: 25)
    private let closeButton = NSButton(title: "✕", target: nil, action: nil)
    private var panelTouchBar: NSTouchBar?
    private var panelVisible = false
    private var agentButtons: [String: AgentButton] = [:]
    private var onScreenOrder: [String] = []
    private var spinnerTimer: Timer?
    private var signalSources: [DispatchSourceSignal] = []
    private var tick = 0
    private var configurationVisible = false
    private var hostViewVisible = false
    private var showUsage = UserDefaults.standard.object(
        forKey: "BBTouchBarShowUsage"
    ) as? Bool ?? true
    private var showHostMonitor = UserDefaults.standard.object(
        forKey: "BBTouchBarShowHostMonitor"
    ) as? Bool ?? true
    private var usageProviderVisibility: [String: Bool] = [
        "codex": UserDefaults.standard.object(forKey: "BBTouchBarUsageCodex") as? Bool ?? true,
        "claudeCode": UserDefaults.standard.object(forKey: "BBTouchBarUsageClaude") as? Bool ?? true,
        "cursor": UserDefaults.standard.object(forKey: "BBTouchBarUsageCursor") as? Bool ?? true,
    ]
    private var selectedProject = UserDefaults.standard.string(
        forKey: "BBTouchBarSelectedProject"
    )
    private var sortMode: SortMode = {
        let stored = UserDefaults.standard.string(forKey: "BBTouchBarSortMode") ?? ""
        return SortMode(rawValue: stored) ?? .status
    }()

    private static let barHeight: CGFloat = 30

    func install() {
        stripButton.target = self
        stripButton.action = #selector(openPanel)
        stripButton.font = .monospacedDigitSystemFont(ofSize: 14, weight: .semibold)
        stripButton.setAccessibilityLabel("BB agents")
        stripButton.frame = NSRect(x: 0, y: 0, width: 88, height: Self.barHeight)
        stripItem.view = stripButton
        configurePanelControls()

        DFRSystemModalShowsCloseBoxWhenFrontMost(false)
        NSTouchBarItem.addSystemTrayItem(stripItem)
        assertStripPresence()

        let center = NSWorkspace.shared.notificationCenter
        for name in [NSWorkspace.didWakeNotification,
                     NSWorkspace.screensDidWakeNotification,
                     NSWorkspace.sessionDidBecomeActiveNotification] {
            center.addObserver(self, selector: #selector(assertStripPresence), name: name, object: nil)
        }
        installSignalHandlers()
        store.onChange = { [weak self] snapshot in self?.apply(snapshot) }
        store.start()
        apply(store.snapshot)
        NativeLog.info("native Control Strip item installed")
    }

    private func configurePanelControls() {
        settingsButton.target = self
        settingsButton.action = #selector(settingsTapped(_:))
        settingsButton.bezelColor = NSColor(white: 0.18, alpha: 1)
        settingsButton.setAccessibilityLabel("BB Touch Bar settings")
        if let image = NSImage(
            systemSymbolName: "slider.horizontal.3",
            accessibilityDescription: "BB Touch Bar settings"
        ) {
            settingsButton.image = image
            settingsButton.imagePosition = .imageOnly
            settingsButton.imageScaling = .scaleProportionallyDown
            settingsButton.contentTintColor = .white
        } else {
            settingsButton.title = "CFG"
        }

        priorityButton.target = self
        priorityButton.action = #selector(priorityTapped(_:))
        priorityButton.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        projectButton.target = self
        projectButton.action = #selector(projectTapped(_:))
        projectButton.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        dockButton.target = self
        dockButton.action = #selector(dockTapped(_:))
        dockButton.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        carouselButton.target = self
        carouselButton.action = #selector(carouselTapped(_:))
        carouselButton.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        previousProjectButton.target = self
        previousProjectButton.action = #selector(previousProjectTapped(_:))
        previousProjectButton.font = .systemFont(ofSize: 17, weight: .bold)
        nextProjectButton.target = self
        nextProjectButton.action = #selector(nextProjectTapped(_:))
        nextProjectButton.font = .systemFont(ofSize: 17, weight: .bold)
        hostMonitorButton.target = self
        hostMonitorButton.action = #selector(hostMonitorTapped(_:))
        hostMonitorButton.setAccessibilityLabel("Show Host Monitor metrics")
        if let image = NSImage(
            systemSymbolName: "desktopcomputer",
            accessibilityDescription: "Host Monitor"
        ) {
            hostMonitorButton.image = image
            hostMonitorButton.imagePosition = .imageOnly
            hostMonitorButton.imageScaling = .scaleProportionallyDown
            hostMonitorButton.contentTintColor = .white
        } else {
            hostMonitorButton.title = "▣"
        }
        for button in [
            usageToggleButton, hostToggleButton, codexToggleButton,
            claudeToggleButton, cursorToggleButton,
        ] {
            button.font = .monospacedSystemFont(ofSize: 5.8, weight: .bold)
        }
        usageToggleButton.target = self
        usageToggleButton.action = #selector(usageVisibilityTapped(_:))
        hostToggleButton.target = self
        hostToggleButton.action = #selector(hostVisibilityTapped(_:))
        codexToggleButton.target = self
        codexToggleButton.action = #selector(codexVisibilityTapped(_:))
        claudeToggleButton.target = self
        claudeToggleButton.action = #selector(claudeVisibilityTapped(_:))
        cursorToggleButton.target = self
        cursorToggleButton.action = #selector(cursorVisibilityTapped(_:))
        codexToggleButton.image = ProviderIcon.image(for: "codex")
        claudeToggleButton.image = ProviderIcon.image(for: "claude-code")
        cursorToggleButton.image = ProviderIcon.image(for: "cursor")
        for button in [codexToggleButton, claudeToggleButton, cursorToggleButton] {
            button.imagePosition = .imageOnly
            button.imageScaling = .scaleProportionallyDown
        }
        closeButton.target = self
        closeButton.action = #selector(closeTapped(_:))
        closeButton.bezelColor = NSColor(white: 0.18, alpha: 1)
        closeButton.setAccessibilityLabel("Close BB agent panel")

        settingsItem.view = settingsButton
        previousProjectItem.view = previousProjectButton
        nextProjectItem.view = nextProjectButton
        usageItem.view = usageIconsView
        hostMonitorItem.view = hostMonitorButton
        closeItem.view = closeButton
        updateControlColors()
    }

    private func updateControlColors() {
        settingsButton.bezelColor = configurationVisible
            ? .systemIndigo
            : NSColor(white: 0.18, alpha: 1)
        priorityButton.bezelColor = sortMode == .status
            ? .systemBlue
            : NSColor(white: 0.18, alpha: 1)
        projectButton.bezelColor = sortMode == .project
            ? .systemOrange
            : NSColor(white: 0.18, alpha: 1)
        dockButton.bezelColor = sortMode == .dock
            ? .systemTeal
            : NSColor(white: 0.18, alpha: 1)
        carouselButton.bezelColor = sortMode == .carousel
            ? .systemPurple
            : NSColor(white: 0.18, alpha: 1)
        usageToggleButton.title = showUsage ? "ON" : "OFF"
        usageToggleButton.bezelColor = showUsage ? .systemBlue : NSColor(white: 0.18, alpha: 1)
        hostToggleButton.title = showHostMonitor ? "ON" : "OFF"
        hostToggleButton.bezelColor = showHostMonitor ? .systemGreen : NSColor(white: 0.18, alpha: 1)
        codexToggleButton.bezelColor = usageProviderVisibility["codex"] == true
            ? .systemBlue : NSColor(white: 0.18, alpha: 1)
        claudeToggleButton.bezelColor = usageProviderVisibility["claudeCode"] == true
            ? .systemOrange : NSColor(white: 0.18, alpha: 1)
        cursorToggleButton.bezelColor = usageProviderVisibility["cursor"] == true
            ? .systemPurple : NSColor(white: 0.18, alpha: 1)
        hostMonitorButton.bezelColor = hostViewVisible
            ? .systemGreen : NSColor(white: 0.18, alpha: 1)
    }

    func uninstall() {
        closePanel(teardown: true)
        spinnerTimer?.invalidate()
        spinnerTimer = nil
        store.stop()
        NSWorkspace.shared.notificationCenter.removeObserver(self)
        DFRElementSetControlStripPresenceForIdentifier(.bbStrip, false)
        NSTouchBarItem.removeSystemTrayItem(stripItem)
        NativeLog.info("native Control Strip item removed")
    }

    @objc private func assertStripPresence() {
        DFRElementSetControlStripPresenceForIdentifier(.bbStrip, true)
    }

    private func installSignalHandlers() {
        for (sig, opens) in [(SIGUSR1, true), (SIGUSR2, false)] {
            signal(sig, SIG_IGN)
            let source = DispatchSource.makeSignalSource(signal: sig, queue: .main)
            source.setEventHandler { [weak self] in
                guard let self else { return }
                opens ? self.stripButton.performClick(nil) : self.closePanel()
            }
            source.resume()
            signalSources.append(source)
        }
    }

    private func apply(_ snapshot: AgentSnapshot) {
        renderStrip(snapshot)
        updateAccessoryButtons(snapshot)
        if panelVisible {
            if !configurationVisible,
               !hostViewVisible,
               snapshot.connected,
               organized(snapshot.agents).map(\.id) == onScreenOrder,
               !snapshot.agents.isEmpty {
                for entry in snapshot.agents { repaint(entry) }
            } else {
                renderPanel(snapshot)
            }
        }
        syncSpinner(snapshot)
    }

    private func updateAccessoryButtons(_ snapshot: AgentSnapshot) {
        usageIconsView.update(
            entries: snapshot.usage,
            visibility: usageProviderVisibility
        )
        let connected = snapshot.hosts.filter { $0.status == "connected" }.count
        hostMonitorButton.setAccessibilityLabel(
            snapshot.hosts.isEmpty
                ? "Host Monitor, metrics loading"
                : "Host Monitor, \(connected) of \(snapshot.hosts.count) hosts connected"
        )
    }

    private func syncSpinner(_ snapshot: AgentSnapshot) {
        if snapshot.working > 0, spinnerTimer == nil {
            let timer = Timer(timeInterval: Spinner.interval, repeats: true) { [weak self] _ in
                self?.advanceSpinner()
            }
            RunLoop.main.add(timer, forMode: .common)
            spinnerTimer = timer
        } else if snapshot.working == 0, let timer = spinnerTimer {
            timer.invalidate()
            spinnerTimer = nil
        }
    }

    private func advanceSpinner() {
        tick &+= 1
        renderStrip(store.snapshot)
        if panelVisible {
            for entry in store.snapshot.agents where entry.status.isBusy { repaint(entry) }
        }
    }

    private func renderStrip(_ snapshot: AgentSnapshot) {
        guard snapshot.connected else {
            stripButton.attributedTitle = attributed("⃠ BB", color: .white)
            stripButton.bezelColor = .systemRed
            return
        }
        let spin = Spinner.frame(tick)
        let text: String
        let color: NSColor
        if snapshot.blocked > 0 && snapshot.working > 0 {
            text = "⏸\(snapshot.blocked) \(spin)\(snapshot.working)"
            color = .systemRed
        } else if snapshot.blocked > 0 {
            text = "⏸ \(snapshot.blocked)"
            color = .systemRed
        } else if snapshot.working > 0 {
            text = "\(spin) \(snapshot.working)"
            color = .systemBlue
        } else if snapshot.done > 0 {
            text = "✓ \(snapshot.done)"
            color = .systemGreen
        } else {
            text = "⠿ \(snapshot.agents.count)"
            color = NSColor(white: 0.22, alpha: 1)
        }
        stripButton.attributedTitle = attributed(text, color: .white)
        stripButton.bezelColor = color
    }

    @objc private func openPanel() {
        let bar = NSTouchBar()
        bar.delegate = self
        bar.defaultItemIdentifiers = panelIdentifiers()
        panelTouchBar = bar
        panelVisible = true
        onScreenOrder = []
        renderPanel(store.snapshot)
        NSTouchBar.presentSystemModalTouchBar(
            bar,
            placement: 1,
            systemTrayItemIdentifier: .bbStrip
        )
        assertStripPresence()
    }

    private func panelIdentifiers() -> [NSTouchBarItem.Identifier] {
        var identifiers: [NSTouchBarItem.Identifier] = []
        if !configurationVisible && sortMode == .carousel {
            identifiers.append(.bbPreviousProject)
        }
        identifiers.append(contentsOf: [.bbList])
        if !configurationVisible && sortMode == .carousel {
            identifiers.append(.bbNextProject)
        }
        identifiers.append(.flexibleSpace)
        if !configurationVisible {
            if showUsage { identifiers.append(.bbUsage) }
            if showHostMonitor { identifiers.append(.bbHostMonitor) }
        }
        identifiers.append(contentsOf: [.bbSettings, .bbClose])
        return identifiers
    }

    private func closePanel(teardown: Bool = false) {
        panelVisible = false
        agentButtons.removeAll()
        onScreenOrder = []
        if let bar = panelTouchBar {
            if teardown {
                NSTouchBar.dismissSystemModalTouchBar(bar)
            } else {
                NSTouchBar.minimizeSystemModalTouchBar(bar)
            }
            panelTouchBar = nil
        }
        assertStripPresence()
    }

    @objc private func closeTapped(_ sender: NSButton) {
        NativeLog.info("close control tapped")
        closePanel()
    }

    @objc private func settingsTapped(_ sender: NSButton) {
        configurationVisible.toggle()
        updateControlColors()
        panelTouchBar?.defaultItemIdentifiers = panelIdentifiers()
        schedulePanelRender()
        NativeLog.info("settings controls \(configurationVisible ? "opened" : "closed")")
    }

    @objc private func priorityTapped(_ sender: NSButton) {
        selectSortMode(.status)
    }

    @objc private func projectTapped(_ sender: NSButton) {
        selectSortMode(.project)
    }

    @objc private func dockTapped(_ sender: NSButton) {
        selectSortMode(.dock)
    }

    @objc private func carouselTapped(_ sender: NSButton) {
        selectSortMode(.carousel)
    }

    @objc private func hostMonitorTapped(_ sender: NSButton) {
        hostViewVisible.toggle()
        updateControlColors()
        schedulePanelRender()
    }

    @objc private func usageVisibilityTapped(_ sender: NSButton) {
        showUsage.toggle()
        UserDefaults.standard.set(showUsage, forKey: "BBTouchBarShowUsage")
        updateControlColors()
    }

    @objc private func hostVisibilityTapped(_ sender: NSButton) {
        showHostMonitor.toggle()
        if !showHostMonitor { hostViewVisible = false }
        UserDefaults.standard.set(showHostMonitor, forKey: "BBTouchBarShowHostMonitor")
        updateControlColors()
        schedulePanelRender()
    }

    @objc private func codexVisibilityTapped(_ sender: NSButton) {
        toggleUsageProvider("codex", defaultsKey: "BBTouchBarUsageCodex")
    }

    @objc private func claudeVisibilityTapped(_ sender: NSButton) {
        toggleUsageProvider("claudeCode", defaultsKey: "BBTouchBarUsageClaude")
    }

    @objc private func cursorVisibilityTapped(_ sender: NSButton) {
        toggleUsageProvider("cursor", defaultsKey: "BBTouchBarUsageCursor")
    }

    private func toggleUsageProvider(_ id: String, defaultsKey: String) {
        let next = usageProviderVisibility[id] != true
        usageProviderVisibility[id] = next
        UserDefaults.standard.set(next, forKey: defaultsKey)
        updateControlColors()
        updateAccessoryButtons(store.snapshot)
    }

    @objc private func previousProjectTapped(_ sender: NSButton) {
        moveProject(by: -1)
    }

    @objc private func nextProjectTapped(_ sender: NSButton) {
        moveProject(by: 1)
    }

    @objc private func projectDockTapped(_ sender: NSButton) {
        guard let project = sender.identifier?.rawValue else { return }
        selectedProject = project
        UserDefaults.standard.set(project, forKey: "BBTouchBarSelectedProject")
        schedulePanelRender()
    }

    private func moveProject(by offset: Int) {
        let projects = orderedProjects(in: organized(store.snapshot.agents))
        guard !projects.isEmpty else { return }
        let current = selectedProject.flatMap { projects.firstIndex(of: $0) } ?? 0
        let next = (current + offset + projects.count) % projects.count
        selectedProject = projects[next]
        UserDefaults.standard.set(projects[next], forKey: "BBTouchBarSelectedProject")
        schedulePanelRender()
    }

    private func selectSortMode(_ mode: SortMode) {
        sortMode = mode
        hostViewVisible = false
        configurationVisible = false
        UserDefaults.standard.set(sortMode.rawValue, forKey: "BBTouchBarSortMode")
        updateControlColors()
        panelTouchBar?.defaultItemIdentifiers = panelIdentifiers()
        schedulePanelRender()
    }

    private func schedulePanelRender() {
        DispatchQueue.main.async { [weak self] in
            guard let self, self.panelVisible else { return }
            self.renderPanel(self.store.snapshot)
        }
    }

    @objc private func agentTapped(_ sender: NSButton) {
        guard let id = sender.identifier?.rawValue,
              let entry = store.snapshot.agents.first(where: { $0.id == id }) else { return }
        AgentStore.focus(entry)
    }

    func touchBar(
        _ touchBar: NSTouchBar,
        makeItemForIdentifier identifier: NSTouchBarItem.Identifier
    ) -> NSTouchBarItem? {
        switch identifier {
        case .bbList: return panelItem
        case .bbSettings: return settingsItem
        case .bbPriority: return priorityItem
        case .bbProject: return projectItem
        case .bbDock: return dockItem
        case .bbCarousel: return carouselItem
        case .bbPreviousProject: return previousProjectItem
        case .bbNextProject: return nextProjectItem
        case .bbUsage: return usageItem
        case .bbHostMonitor: return hostMonitorItem
        case .bbUsageToggle: return usageToggleItem
        case .bbHostToggle: return hostToggleItem
        case .bbCodexToggle: return codexToggleItem
        case .bbClaudeToggle: return claudeToggleItem
        case .bbCursorToggle: return cursorToggleItem
        case .bbClose: return closeItem
        default: return nil
        }
    }

    private func renderPanel(_ snapshot: AgentSnapshot) {
        agentButtons.removeAll()
        let entries = organized(snapshot.agents)
        onScreenOrder = entries.map(\.id)

        if configurationVisible {
            panelItem.view = scrollContainer(settingsGroups())
            return
        }

        if hostViewVisible {
            let views: [NSView] = snapshot.hosts.isEmpty
                ? [message("Host metrics are loading…")]
                : snapshot.hosts.map { HostMetricView(entry: $0) }
            panelItem.view = scrollContainer(views)
            return
        }

        var views: [NSView] = []
        if entries.isEmpty {
            views.append(message(snapshot.connected ? "No BB threads" : "BB is offline"))
        } else {
            if !snapshot.connected {
                views.append(message("Reconnecting…"))
            }
            if sortMode == .status {
                views.append(contentsOf: entries.map { button(for: $0) })
            } else if sortMode == .project {
                views.append(contentsOf: projectGroups(for: entries))
            } else if let project = resolvedProject(in: entries) {
                let projectEntries = entries.filter { $0.project == project }
                if sortMode == .dock {
                    for name in orderedProjects(in: entries) {
                        guard let first = entries.first(where: { $0.project == name }) else {
                            continue
                        }
                        let badge = GroupDividerView(
                            status: first.status,
                            project: name,
                            count: entries.filter { $0.project == name }.count,
                            projectFirst: true,
                            threadId: name,
                            target: self,
                            action: #selector(projectDockTapped(_:))
                        )
                        badge.setSelected(name == project)
                        views.append(badge)
                    }
                } else if let first = projectEntries.first {
                    let badge = GroupDividerView(
                        status: first.status,
                        project: project,
                        count: projectEntries.count,
                        projectFirst: true,
                        threadId: first.id,
                        target: self,
                        action: #selector(agentTapped(_:))
                    )
                    badge.setSelected(true)
                    views.append(badge)
                }
                views.append(contentsOf: projectEntries.map { button(for: $0) })
            }
        }
        panelItem.view = scrollContainer(views)
    }

    private func settingsGroups() -> [NSView] {
        [
            SettingsGroupView(
                title: "FILTERS",
                controls: [priorityButton, projectButton, dockButton, carouselButton]
            ),
            SettingsGroupView(
                title: "SUBSCRIPTIONS",
                controls: [
                    usageToggleButton, codexToggleButton,
                    claudeToggleButton, cursorToggleButton,
                ]
            ),
            SettingsGroupView(
                title: "HOST MONITOR",
                controls: [hostToggleButton]
            ),
        ]
    }

    private func projectGroups(for entries: [AgentEntry]) -> [NSView] {
        var groups: [NSView] = []
        var index = 0
        while index < entries.count {
            let first = entries[index]
            var end = index + 1
            while end < entries.count && entries[end].project == first.project {
                end += 1
            }
            let projectEntries = Array(entries[index..<end])
            var nested: [NSView] = [GroupDividerView(
                status: first.status,
                project: first.project,
                count: projectEntries.count,
                projectFirst: true,
                threadId: first.id,
                target: self,
                action: #selector(agentTapped(_:))
            )]
            nested.append(contentsOf: projectEntries.map {
                button(for: $0, grouped: true)
            })
            groups.append(ProjectGroupView(views: nested))
            index = end
        }
        return groups
    }

    private func message(_ text: String) -> NSView {
        let label = NSTextField(labelWithString: text)
        label.font = .systemFont(ofSize: 14)
        label.textColor = NSColor(white: 0.62, alpha: 1)
        return label
    }

    private func button(for entry: AgentEntry, grouped: Bool = false) -> NSButton {
        let button = AgentButton(target: self, action: #selector(agentTapped(_:)))
        button.identifier = NSUserInterfaceItemIdentifier(entry.id)
        button.frame.size = NSSize(width: 145, height: Self.barHeight)
        button.setGrouped(grouped)
        agentButtons[entry.id] = button
        paint(button, entry)
        return button
    }

    private func organized(_ entries: [AgentEntry]) -> [AgentEntry] {
        let rank: [AgentStatus: Int] = [.blocked: 0, .done: 1, .working: 2, .waiting: 3, .idle: 4, .unknown: 5]
        return entries.sorted {
            let left = rank[$0.status, default: 5]
            let right = rank[$1.status, default: 5]
            let projectOrder = $0.project.localizedCaseInsensitiveCompare($1.project)
            if sortMode == .project || sortMode == .dock || sortMode == .carousel {
                if projectOrder != .orderedSame { return projectOrder == .orderedAscending }
                if left != right { return left < right }
            } else {
                if left != right { return left < right }
            }
            return $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
        }
    }

    private func orderedProjects(in entries: [AgentEntry]) -> [String] {
        var seen = Set<String>()
        return entries.compactMap { entry in
            seen.insert(entry.project).inserted ? entry.project : nil
        }
    }

    private func resolvedProject(in entries: [AgentEntry]) -> String? {
        let projects = orderedProjects(in: entries)
        guard !projects.isEmpty else { return nil }
        if let selectedProject, projects.contains(selectedProject) {
            return selectedProject
        }
        selectedProject = projects[0]
        UserDefaults.standard.set(projects[0], forKey: "BBTouchBarSelectedProject")
        return projects[0]
    }

    private func repaint(_ entry: AgentEntry) {
        guard let button = agentButtons[entry.id] else { return }
        paint(button, entry)
    }

    private func paint(_ button: AgentButton, _ entry: AgentEntry) {
        let prefix: String
        switch entry.status {
        case .working: prefix = Spinner.frame(tick) + " "
        case .blocked: prefix = "⏸ "
        case .done: prefix = ""
        case .waiting: prefix = "↻ "
        case .idle, .unknown: prefix = ""
        }
        button.update(entry: entry, primary: prefix + entry.title)
    }

    private func attributed(_ text: String, color: NSColor) -> NSAttributedString {
        NSAttributedString(string: text, attributes: [
            .foregroundColor: color,
            .font: NSFont.monospacedDigitSystemFont(ofSize: 14, weight: .medium),
        ])
    }

    private func scrollContainer(_ views: [NSView]) -> NSView {
        let stack = NSStackView(views: views)
        stack.orientation = .horizontal
        stack.spacing = 5
        stack.alignment = .centerY
        stack.translatesAutoresizingMaskIntoConstraints = true

        let fitting = stack.fittingSize
        let visible = min(max(fitting.width, 100), 850)
        stack.frame = NSRect(
            x: 0,
            y: 0,
            width: max(fitting.width, visible),
            height: Self.barHeight
        )

        let scroll = NSScrollView(frame: NSRect(
            x: 0,
            y: 0,
            width: visible,
            height: Self.barHeight
        ))
        scroll.drawsBackground = false
        scroll.hasHorizontalScroller = false
        scroll.hasVerticalScroller = false
        scroll.horizontalScrollElasticity = .allowed
        scroll.verticalScrollElasticity = .none
        scroll.documentView = stack
        return scroll
    }
}
