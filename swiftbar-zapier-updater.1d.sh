#!/usr/bin/env bash
# <bitbar.title>SwiftBar for Zapier: Updater</bitbar.title>
# <bitbar.version>v0.0.1</bitbar.version>
# <bitbar.author>Christian Wernert</bitbar.author>
# <bitbar.author.github>cwernert</bitbar.author.github>
# <bitbar.dependencies>javascript, node (fetch, fs)</bitbar.dependencies>
# <bitbar.desc>Displays contents set by a Zapier channel</bitbar.desc>
# <bitbar.abouturl>https://github.com/cwernert/swiftbar-zapier</bitbar.abouturl>
# <swiftbar.hideAbout>false</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>false</swiftbar.hideSwiftBar>


# <xbar.title>SwiftBar for Zapier: Updater</xbar.title>
# <xbar.version>v0.1</xbar.version>
# <xbar.author>Christian Wernert</xbar.author>
# <xbar.author.github>cwernert</xbar.author.github>
# <xbar.desc>Checks for updates to the swiftbar-zapier plugin.</xbar.desc>
# <xbar.image>https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg</xbar.image>
# <xbar.dependencies>zsh</xbar.dependencies>
# <xbar.abouturl>https://github.com/cwernert/swiftbar-zapier</xbar.abouturl>
# <swiftbar.hideAbout>true</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>true</swiftbar.hideSwiftBar>

# I think this is likely to allow SwiftBar to parse unwanted files as plugins
# Probably need to check version numbers, & if GitHub has a later version then invoke a separate shell script which isn't a SwiftBar plugin
# That way, it can pkill -x SwiftBar, curl the files, chflags hide them all, then open -a SwiftBar again

cd $SWIFTBAR_PLUGINS_PATH
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier.10s.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-updater.1d.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
npm update
cd config
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.json
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
chmod 755 swiftbar-zapier-config.js
chmod 755 swiftbar-zapier-config.sh
npm update
cd ../
chflags hidden * && chflags nohidden swiftbar-zapier.10s.js && chflags nohidden swiftbar-zapier-updater.1d.js
