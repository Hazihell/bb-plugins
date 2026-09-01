import AppKit

signal(SIGUSR1, SIG_IGN)
signal(SIGUSR2, SIG_IGN)
signal(SIGTERM, SIG_IGN)
signal(SIGINT, SIG_IGN)

final class AppDelegate: NSObject, NSApplicationDelegate {
    private let controller = TouchBarController()
    private var menuBarController: MenuBarController?
    private var terminationSources: [DispatchSourceSignal] = []

    private var readinessURL: URL {
        NativeConfig.applicationSupport.appendingPathComponent("BBTouchBar.ready")
    }

    func applicationDidFinishLaunching(_ notification: Notification) {
        for sig in [SIGTERM, SIGINT] {
            let source = DispatchSource.makeSignalSource(signal: sig, queue: .main)
            source.setEventHandler { NSApp.terminate(nil) }
            source.resume()
            terminationSources.append(source)
        }

        try? FileManager.default.createDirectory(
            at: NativeConfig.applicationSupport,
            withIntermediateDirectories: true
        )
        menuBarController = MenuBarController(touchBarController: controller)
        controller.onSettingsRequested = { [weak self] in
            self?.menuBarController?.showMenu()
        }
        controller.install()
        try? "\(ProcessInfo.processInfo.processIdentifier)\n".write(
            to: readinessURL,
            atomically: true,
            encoding: .utf8
        )
    }

    func applicationWillTerminate(_ notification: Notification) {
        try? FileManager.default.removeItem(at: readinessURL)
        controller.onSettingsRequested = nil
        controller.uninstall()
    }
}

let bundleIdentifier = Bundle.main.bundleIdentifier ?? "app.getbb.touchbar.native"
let others = NSRunningApplication
    .runningApplications(withBundleIdentifier: bundleIdentifier)
    .filter { $0.processIdentifier != ProcessInfo.processInfo.processIdentifier }
for other in others { other.terminate() }
if !others.isEmpty { Thread.sleep(forTimeInterval: 0.4) }

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let delegate = AppDelegate()
app.delegate = delegate
app.run()
