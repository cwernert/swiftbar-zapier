#!/usr/bin/env bash

pkill -x SwiftBar
cd $1/swiftbar-zapier
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier.10s.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
npm update
cd config
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-update.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-config.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/swiftbar-zapier-config.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/config/package.json
chmod 755 swiftbar-zapier-config.js
chmod 755 swiftbar-zapier-config.sh
chmod 755 swiftbar-zapier-update.sh
npm update
cd $1/swiftbar-zapier
chflags hidden * && chflags nohidden swiftbar-zapier.10s.js
open -a SwiftBar
