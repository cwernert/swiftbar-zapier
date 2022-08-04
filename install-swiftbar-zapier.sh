#!/usr/bin/env bash
clear
echo "This script will install swiftbar-zapier on your computer."
echo "If SwiftBar is currently running, it will be closed now and opened again once installation is complete."
while true; do
  read -p "Are you ready to continue? (y/n)"
  case $yn in
    [yY] ) echo "Installing swiftbar-zapier..."
            break;;
    [nN] ) echo "Exiting. Installation aborted."
            exit;;
    * ) echo "Invalid response. Please enter Y or N.";;
  esac
done
pkill -x SwiftBar
echo "Creating swiftbar-zapier directory..."
mkdir -p ~/Applications/SwiftBar-Plugins/swiftbar-zapier
cd ~/Applications/SwiftBar-Plugins/swiftbar-zapier
echo "Downloading swiftbar-zapier resources..."
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier.10s.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-updater.1d.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json
echo "Creating config directory..."
mkdir config
cd config
echo "Downloading swiftbar-zapier-config resources..."
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.sh
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.js
curl -O https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/swiftbar-zapier-config.json
echo "Checking availability of dependencies..."
installed="Installed:"
required="Required:"
reqCount=0
#checking node
if which node > /dev/null; then
  installed=$installed" node"
else
  required=$required" node"
  ((reqCount=reqCount+1))
fi
#checking npm
if which npm > /dev/null; then
  installed=$installed" npm"
else
  required=$required" npm"
  ((reqCount=reqCount+1))
fi
#checking swiftbar
if mdfind "kMDItemKind == 'Application'" | grep -q 'SwiftBar.app'; then
  installed=$installed" swiftbar"
else
  if brew ls --versions | grep -q 'swiftbar'; then
    installed=$installed" swiftbar"
  else
    required=$required" swiftbar"
    ((reqCount=reqCount+1))
  fi
fi
#checking xcode-select
xcode-select -p 1>/dev/null;
if [[ $? != 0 ]] ; then
  required=$required" xcode-select"
  ((reqCount=reqCount+1))
else
  installed=$installed" xcode-select"
fi
#checking Homebrew
which -s brew
if [[ $? != 0 ]] ; then
  required=$required" homebrew"
  ((reqCount=reqCount+1))
else
	installed=$installed" homebrew"
fi
#install dependencies if needed
if [[ $reqCount > 0 ]] ; then
  echo $reqCount" required dependencies are not installed."
  echo $installed
  echo $required
  #ask user if they want to install
  while true; do
    read -p "Do you want to install the required dependencies now? (y/n)"
    case $yn in
      [yY] ) echo "Installing dependencies..."
              break;;
      [nN] ) echo "Exiting. Installation aborted."
              exit;;
      * ) echo "Invalid response. Please enter Y or N.";;
    esac
  done
  if echo $required | grep -q 'xcode-select'; then
    xcode-select --install
  fi
  if echo $required | grep -q 'homebrew'; then
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
    brew update
  fi
  if echo $required | grep -q 'node\|npm'; then
    brew install node
  fi
  if echo $required | grep -q 'swiftbar'; then
    brew install swiftbar
  fi
else
  echo "All dependencies are installed."
  echo $installed
fi
echo "Installation complete. Starting SwiftBar..."
open -a SwiftBar
echo "Done. You should now see swiftbar-zapier in your MacOS menu bar."
echo "If not, please ensure your SwiftBar-Plugins folder is set to ~/Applications/SwiftBar-Plugins"
