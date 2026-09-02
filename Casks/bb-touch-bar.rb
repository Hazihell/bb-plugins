cask "bb-touch-bar" do
  version "0.1.0"
  sha256 "d5ff75e00d62eea0a13f2e37e278faa02d3142f8e1cbbda47dc868060ff2592d"

  url "https://github.com/MateoCerquetella/bb-plugins/releases/download/touchbar%2Fv#{version}/BBTouchBar-#{version}-universal.zip"
  name "BB Touch Bar"
  desc "Persistent BB agent, subscription, and host status for MacBook Pro Touch Bars"
  homepage "https://github.com/MateoCerquetella/bb-plugins/tree/main/plugins/touchbar"

  depends_on macos: :big_sur

  app "package-#{version}/BBTouchBar.app", target: "BB Touch Bar.app"

  postflight do
    system_command "#{staged_path}/package-#{version}/homebrew-install.sh",
                   args: ["#{appdir}/BB Touch Bar.app"]
  end

  uninstall script: {
    executable:   "package-#{version}/homebrew-uninstall.sh",
    must_succeed: false,
  }

  zap trash: [
    "~/Library/Application Support/BBTouchBar",
    "~/Library/Logs/bb-touchbar.log",
    "~/Library/Preferences/app.getbb.touchbar.native.plist",
  ]

  caveats <<~EOS
    BB Touch Bar requires the BB CLI and the server-side Touch Bar plugin.
    Install the plugin on the BB server with:
      bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^#{version} --subdirectory plugins/touchbar --tag-prefix touchbar/

    The app uses private macOS Touch Bar frameworks and is not eligible for the App Store.
  EOS
end
