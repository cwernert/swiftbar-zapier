#!/usr/bin/env bash
# <bitbar.title>SwiftBar for Zapier: Updater</bitbar.title>
# <bitbar.version>v0.0.1</bitbar.version>
# <bitbar.author>Christian Wernert</bitbar.author>
# <bitbar.author.github>cwernert</bitbar.author.github>
# <bitbar.dependencies>bash</bitbar.dependencies>
# <bitbar.desc>Checks for updates to the swiftbar-zapier plugin.</bitbar.desc>
# <bitbar.abouturl>https://github.com/cwernert/swiftbar-zapier</bitbar.abouturl>
# <swiftbar.hideAbout>true</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>true</swiftbar.hideSwiftBar>

# I think this is likely to allow SwiftBar to parse unwanted files as plugins
# Probably need to check version numbers, & if GitHub has a later version then invoke a separate shell script which isn't a SwiftBar plugin
# That way, it can pkill -x SwiftBar, curl the files, chflags hide them all, then open -a SwiftBar again

cd $SWIFTBAR_PLUGINS_PATH/swiftbar-zapier
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier.10s.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-updater.1d.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
npm update
cd config
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-config.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-config.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-config.json
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/package.json
chmod 755 swiftbar-zapier-config.js
chmod 755 swiftbar-zapier-config.sh
npm update
cd ../
chflags hidden * && chflags nohidden swiftbar-zapier.10s.js && chflags nohidden swiftbar-zapier-updater.1d.sh
