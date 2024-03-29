# swiftbar-zapier

A plugin for [the SwiftBar app](https://swiftbar.app/), which presents content collected by [Zapier](https://zapier.com).

1. [Installation](#installation)
2. [Usage](#usage)
	- [Creating a Channel ID](#creating-a-channel-id)
	- [Adding your Channel ID to swiftbar-zapier](#adding-your-channel-id-to-swiftbar-zapier)
	- [Populating the Channel with content](#populating-the-channel-with-content)
3. [Updates](#updates)
4. [Uninstallation](#uninstallation)
5. [Troubleshooting](#troubleshooting)

## Installation:

Run the following command in Terminal:
> `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/install-swiftbar-zapier.sh)"`
---
If you would like to check what the script will do before running it, you can [review the source here](https://github.com/cwernert/swiftbar-zapier/blob/main/install-swiftbar-zapier.sh). In summary it will:

1. Confirm that you are ready to proceed
2. Close SwiftBar if it is already running
3. Check for required dependencies ([node](https://nodejs.org/en/), [npm](https://www.npmjs.com/), [swiftbar](https://github.com/swiftbar/SwiftBar/releases/tag/v1.4.3), [homebrew](https://brew.sh/))
4. Install any dependencies that weren't already present
5. Create the SwiftBar-Plugins directory and necessary subdirectories
6. Download necessary resources from this GitHub repo into those directories
7. Set executable permissions on the files which need to be executed
8. Use `npm update` to download the required node modules into respective locations
9. Hide all files except the main plugin script, to prevent SwiftBar from running them as plugins
10. Open the SwiftBar application

## Usage:

Once installed, you should see "Please add a Channel ID" in the MenuBar [like this](https://cdn.zappy.app/918bc8b5cd7a8a8fd20cd0052a8a0da7.png):
<img src="https://cdn.zappy.app/918bc8b5cd7a8a8fd20cd0052a8a0da7.png" alt='"Please add a Channel ID" shown in the MenuBar' />

If not, see [troubleshooting](#troubleshooting).

Now, you're ready to set up a "Channel", which will hold the information to be presented in swiftbar-zapier. To do this, you'll need:
* A Zapier account
* Access to the SwiftBar Zapier integration (currently "Private")

> The integration is functional, but still in development, so it remains Private for the time being. Please contact me on Slack if you would like access.

### Creating a Channel ID:

1. Create a new Zap, and add a "Set Channel Title & Content in SwiftBar" action to it (any event will do, but this one will allow you to populate the channel with content to verify a successful setup).
2. At the "Choose Account" stage, click "Connect a new account" to see [this page](https://cdn.zappy.app/e1c6eb8078583d707b2eb3b97f022284.png)
3. Use [a UUID4 Generator](https://www.uuidgenerator.net/version4) to create a Channel ID, and copy/paste it into the "Channel ID" field
4. (Optional) Enter a name for the channel. This will help to identify the connection in Zapier's UI and will be visible in SwiftBar when more than one Channel ID is configured, to differentiate content from each channel.
5. Proceed to [add some content to the channel](#populating-the-channel-with-content) by testing the Zap action

### Adding your Channel ID to swiftbar-zapier:

1. Click "Please add a Channel ID" in your MacOS MenuBar to open the submenu
2. Select "Add a new Channel ID" from the menu (see note below)
3. Paste your UUID4 into the Terminal prompt
4. Content set by Zapier will now be displayed in your MenuBar, and you can safely exit Terminal

> During step 2 listed above, MacOS is likely to require that you grant SwiftBar permission to execute scripts in Terminal. In order to continue, please do so [like this](https://cdn.zappy.app/a9b58528ad77af2d4451f71515950674.png).

### Populating the Channel with content:

> A detailed guide on SwiftBar syntax can be found [here](https://github.com/swiftbar/SwiftBar/tree/v1.4.3#script-output).

SwiftBar content is comprised of two primary elements; *header* and *body*. For the purposes of swiftbar-zapier, these are referred to as *title* and *content* respectively.

A *Channel* can contain a single *Title* and many lines of *Content*. *Titles* are displayed in the MacOS menu bar, while lines of *Content* are listed in the submenu which opens when swiftbar-zapier is clicked.

If more than one *Channel* is added to your swiftbar-zapier, *Titles* will be displayed one at a time in a loop, while the submenu is populated with the *Content* from all *Channels*, separated by their respective Channel Names.

**The simplest way to add content to a channel** is by adding values to a "Set Channel Title & Content" action [like this](https://cdn.zappy.app/a881b59807e4a00ac9f2498a42fc7dd5.png).

<img src="https://cdn.zappy.app/a881b59807e4a00ac9f2498a42fc7dd5.png" alt="Adding basic content to swiftbar-zapier" width="500" />

**To add more advanced content**, such as links, checkmarks, custom formatting etc. you can [refer to SwiftBar's documentation](https://github.com/swiftbar/SwiftBar/tree/v1.4.3#script-output), or use the "Prepare custom Title/Content" action to generate SwiftBar syntax automatically, [like this](https://cdn.zappy.app/8d618af22d1064dc7dad2431a1ba2fc7.png).

Like any other mapped value in Zapier, the output from a "Prepare custom Title/Content" action can be mapped to the "Set Channel Title & Content" action, [like this](https://cdn.zappy.app/920cce7664bbec02889868d9392267e8.png):

<img src="https://cdn.zappy.app/920cce7664bbec02889868d9392267e8.png" alt="Adding advanced content to swiftbar-zapier" width="500" />
> *Shown above: a content item is generated by a "Prepare custom Title/Content" step and added to a channel. When clicked, the item will open zapier.com in the user's default browser. Also, examples of manually-typed SwiftBar syntax.*

## Updates:

swiftbar-zapier automatically checks for updates each time it runs. If an update is available, your title content will be prepended with the update icon ⬆️ and [a corresponding submenu item](https://cdn.zappy.app/61dbb6855cbbcc7578e800738a6ebec1.png) will be available:

<img src="https://cdn.zappy.app/61dbb6855cbbcc7578e800738a6ebec1.png" alt="Update available" width="400" />

Clicking this item will close SwiftBar, update swiftbar-zapier and reopen SwiftBar.

## Uninstallation:

To remove swiftbar-zapier from your system, delete the directory at:
> `~/Applications/SwiftBar-Plugins/swiftbar-zapier`

Note that this will not uninstall the dependencies ([node](https://nodejs.org/en/), [npm](https://www.npmjs.com/), [swiftbar](https://github.com/swiftbar/SwiftBar/releases/tag/v1.4.3), [homebrew](https://brew.sh/)) or any other SwiftBar plugins that you may have installed.

## Troubleshooting:

### SwiftBar is running, but I don't see anything in my MenuBar
1. Check to ensure that your SwiftBar Plugin Directory is set to:
	> `~/Applications/SwiftBar-Plugins/swiftbar-zapier`

	This can be done by opening SwiftBar preferences and clicking the "Change" button on the "General" tab.

2. Ensure that the plugin is enabled, by switching to the "Plugins" tab and checking the box beside "SwiftBar for Zapier".

3. Ensure that there is sufficient space available for SwiftBar in your MacOS MenuBar. I personally like to use [Bartender](https://www.macbartender.com/) to help with this, but other options are also available.
