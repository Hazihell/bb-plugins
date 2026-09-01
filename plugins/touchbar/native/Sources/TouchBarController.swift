import AppKit

extension NSTouchBarItem.Identifier {
    static let bbStrip = NSTouchBarItem.Identifier("app.getbb.touchbar.strip")
    static let bbList = NSTouchBarItem.Identifier("app.getbb.touchbar.list")
    static let bbSettings = NSTouchBarItem.Identifier("app.getbb.touchbar.settings")
    static let bbPriority = NSTouchBarItem.Identifier("app.getbb.touchbar.priority")
    static let bbProject = NSTouchBarItem.Identifier("app.getbb.touchbar.project")
    static let bbClose = NSTouchBarItem.Identifier("app.getbb.touchbar.close")
}

private enum SortMode: String {
    case status
    case project
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

    init(views: [NSView], color: NSColor) {
        let nestedStack = NSStackView(views: views)
        nestedStack.orientation = .horizontal
        nestedStack.spacing = 3
        nestedStack.alignment = .centerY
        stack = nestedStack
        measuredWidth = nestedStack.fittingSize.width + 6
        super.init(frame: .zero)
        wantsLayer = true
        layer?.cornerRadius = 6
        layer?.borderWidth = 1
        layer?.borderColor = color.withAlphaComponent(0.8).cgColor
        layer?.backgroundColor = color.withAlphaComponent(0.10).cgColor
        layer?.masksToBounds = true
        addSubview(stack)
    }

    required init?(coder: NSCoder) { fatalError("init(coder:) is unsupported") }
    override var intrinsicContentSize: NSSize {
        NSSize(width: measuredWidth, height: 30)
    }

    override func layout() {
        super.layout()
        stack.frame = NSRect(x: 3, y: 0, width: bounds.width - 6, height: 30)
    }
}

private final class AgentButton: NSButton {
    private let iconView = NSImageView()
    private let titleLabel = NSTextField(labelWithString: "")
    private let badgeLabel = NSTextField(labelWithString: "")
    private let accentLayer = CALayer()
    private var badgeWidth: CGFloat = 30

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
        layer?.backgroundColor = NSColor(white: 0.055, alpha: 0.96).cgColor
        layer?.borderColor = color.withAlphaComponent(0.82).cgColor
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
    private let closeItem = NSCustomTouchBarItem(identifier: .bbClose)
    private let settingsButton = NSButton(title: "", target: nil, action: nil)
    private let priorityButton = NSButton(title: "PRIORITY", target: nil, action: nil)
    private let projectButton = NSButton(title: "PROJECT", target: nil, action: nil)
    private let closeButton = NSButton(title: "✕", target: nil, action: nil)
    private var panelTouchBar: NSTouchBar?
    private var panelVisible = false
    private var agentButtons: [String: AgentButton] = [:]
    private var onScreenOrder: [String] = []
    private var spinnerTimer: Timer?
    private var signalSources: [DispatchSourceSignal] = []
    private var tick = 0
    private var configurationVisible = false
    private var sortMode = SortMode(
        rawValue: UserDefaults.standard.string(forKey: "BBTouchBarSortMode") ?? ""
    ) ?? .status

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
        priorityButton.font = .monospacedSystemFont(ofSize: 7.5, weight: .bold)
        projectButton.target = self
        projectButton.action = #selector(projectSortTapped(_:))
        projectButton.font = .monospacedSystemFont(ofSize: 7.5, weight: .bold)
        closeButton.target = self
        closeButton.action = #selector(closeTapped(_:))
        closeButton.bezelColor = NSColor(white: 0.18, alpha: 1)
        closeButton.setAccessibilityLabel("Close BB agent panel")

        settingsItem.view = settingsButton
        priorityItem.view = priorityButton
        projectItem.view = projectButton
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
            ? .systemTeal
            : NSColor(white: 0.18, alpha: 1)
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
        if panelVisible {
            if snapshot.connected,
               organized(snapshot.agents).map(\.id) == onScreenOrder,
               !snapshot.agents.isEmpty {
                for entry in snapshot.agents { repaint(entry) }
            } else {
                renderPanel(snapshot)
            }
        }
        syncSpinner(snapshot)
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
        var identifiers: [NSTouchBarItem.Identifier] = [.bbList, .flexibleSpace]
        if configurationVisible {
            identifiers.append(contentsOf: [.bbPriority, .bbProject])
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
        NativeLog.info("settings controls \(configurationVisible ? "opened" : "closed")")
    }

    @objc private func priorityTapped(_ sender: NSButton) {
        selectSortMode(.status)
    }

    @objc private func projectSortTapped(_ sender: NSButton) {
        selectSortMode(.project)
    }

    private func selectSortMode(_ mode: SortMode) {
        sortMode = mode
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
        case .bbClose: return closeItem
        default: return nil
        }
    }

    private func renderPanel(_ snapshot: AgentSnapshot) {
        agentButtons.removeAll()
        let entries = organized(snapshot.agents)
        onScreenOrder = entries.map(\.id)

        var views: [NSView] = []
        if !snapshot.connected {
            views.append(message("BB is offline"))
        } else if snapshot.agents.isEmpty {
            views.append(message("No BB threads"))
        } else if sortMode == .status {
            views.append(contentsOf: entries.map { button(for: $0) })
        } else {
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
                nested.append(contentsOf: projectEntries.map { button(for: $0) })
                views.append(ProjectGroupView(
                    views: nested,
                    color: GroupDividerView.projectColor(first.project)
                ))
                index = end
            }
        }
        panelItem.view = scrollContainer(views)
    }

    private func message(_ text: String) -> NSView {
        let label = NSTextField(labelWithString: text)
        label.font = .systemFont(ofSize: 14)
        label.textColor = NSColor(white: 0.62, alpha: 1)
        return label
    }

    private func button(for entry: AgentEntry) -> NSButton {
        let button = AgentButton(target: self, action: #selector(agentTapped(_:)))
        button.identifier = NSUserInterfaceItemIdentifier(entry.id)
        button.frame.size = NSSize(width: 145, height: Self.barHeight)
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
            if sortMode == .project {
                if projectOrder != .orderedSame { return projectOrder == .orderedAscending }
                if left != right { return left < right }
            } else {
                if left != right { return left < right }
            }
            return $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
        }
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
