#!/usr/bin/env bash

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

cd $SWIFTBAR_PLUGINS_PATH
mkdir swiftbar-zapier
cd swiftbar-zapier
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier.10s.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
npm update
chflags hidden * && chflags nohidden swiftbar-zapier.10s.js