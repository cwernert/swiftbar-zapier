#!/usr/bin/env /usr/local/bin/node
/*
# <bitbar.title>SwiftBar for Zapier</bitbar.title>
# <bitbar.version>v0.0.1</bitbar.version>
# <bitbar.author>Christian Wernert</bitbar.author>
# <bitbar.author.github>cwernert</bitbar.author.github>
# <bitbar.dependencies>javascript, node (fetch, fs, semver)</bitbar.dependencies>
# <bitbar.desc>Displays contents set by a Zapier channel</bitbar.desc>
# <bitbar.abouturl>https://github.com/cwernert/swiftbar-zapier</bitbar.abouturl>
# <swiftbar.hideAbout>false</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>false</swiftbar.hideSwiftBar>
*/

const fetch = require('node-fetch');
const fs = require('fs');
const semver = require('semver');

const configdir		= __dirname+"/config";
const configjson	= configdir+"/swiftbar-zapier-config.json";
const configbash	= configdir+"/swiftbar-zapier-config.sh";
const configscript	= configdir+"/swiftbar-zapier-config.js";
const configupdate	= configdir+"/swiftbar-zapier-update.sh";
const defaultconfig = {"channelids":[]};

let fetchingData = false; //this will be true if Swiftbar is calling the Storage API
let update = {
	"available":false,
	"local":"",
	"github":""
};

//checking for updates
const local = JSON.parse(fs.readFileSync(__dirname+'/package.json', 'utf8'));
const ghpkg = "https://raw.githubusercontent.com/cwernert/swiftbar-zapier/main/package.json";
fetch(ghpkg,{method:"GET"}).then(res => res.json()).then((github) => {
	if(semver.lt(local.version,github.version)){
		update.available = true;
		update.local = local.version;
		update.github = github.version;
	}
});

let output = "";
if(update.available){
	output += ":arrow_up: ";
}
// set up config folder
try{
	if(!fs.existsSync(configdir)) {
		fs.mkdirSync(configdir);
	}
}catch(err){
	output = 'Config dir error: ' + error;
}
// check that config file exists
try{
	if(fs.existsSync(configjson)) {
		// config exists, read it
		const config = JSON.parse(fs.readFileSync(configjson,'utf8'));
		if(!config.channelids.length>0){
			output += "Please add a Channel ID";
		}else{
			// call Storage for each of the Channel IDs to collect the data
			fetchingData = true;
			readChannels(config);
		}
	}else{
		//need to create config
		fs.writeFile(configjson, JSON.stringify(defaultconfig), err => {
			if(err){console.error(err);}
			output += "Please add a Channel ID";
		});
	}
}catch(error){
	output = 'Config file error: ' + error;
}
// check that configbash exists
try{
	if(!fs.existsSync(configbash)) {
		// need to create the config script
		fs.writeFile(configbash, "#!/usr/bin/env bash\nCONFIG=$1 METHOD=$2 node $3", err => {
			if(err){console.error(err);}
		});
		fs.chmodSync(configbash, 0o755); //set exec permissions
	}
}catch(error){
	output = 'Config bash error: ' + error;
}
//if the plugin is not async calling for Storage data, it can output right now
if(!fetchingData){
	output+=outputFooter();
	console.log(output);
}

function outputFooter(){
	let footer="\n---";
	footer+="\nAdd a new Channel ID | bash="+configbash+" param0=true param1=adding param3="+configscript;
	footer+="\nRemove a Channel ID | bash="+configbash+" param0=true param1=removing param3="+configscript;
	footer+="\nRefresh | refresh=true";
	if(update.available){
		footer+="\n---";
		footer+="\nUpdate available! Click here to update | bash="+configupdate+" param0="+process.env.SWIFTBAR_PLUGINS_PATH;
	}
	return footer;
}

function getData(id){
	const url = `https://store.zapier.com/api/records?secret=${id}`;
	return new Promise((resolve, reject) => {
		fetch(url).then(function(response){
			return response.json();
		}).then((data)=>{
			//expects the following keys in Storage
			//{"swiftbar_content": "submenu syntax", "swiftbar_name": "Example Channel Name", "swiftbar_title": "title syntax"}
			if(data.error){
				data = resolveError(id,data.error);
			}
			resolve(data);
		}).catch(function(error){
			data = resolveError(id,data.error);
			resolve(data);
		});
	});
}

function resolveError(id,error){
	let data = {};
	data.swiftbar_title = "Channel error";
	data.swiftbar_name = "Channel error";
	data.swiftbar_content = `--Failed to read channel ID:\n--${id}\n--${error}`;
	return data;
}

function readChannels(config){
	//takes the list of channel IDs as input
	//iterates over them with parallel calls to storage to collect the data for each
	let contents = [];
	config.channelids.forEach((channelid)=>{
		contents.push(getData(channelid));
	});
	//once all the parallel calls are done, we can return all the contents for display
	Promise.all(contents).then((allContents)=>{
		//allContents is an array of each object from Storage
		presentOutputs(allContents);
	});
}

function presentOutputs(contents){
	//loop through and present each channel title
	for(let i=0;i<contents.length;i++){
		let titleOutput = "SwiftBar Zapier";
		if(contents[i].swiftbar_title.length>1){
			titleOutput = contents[i].swiftbar_title;
		}
		if(update.available){
			titleOutput = ":arrow_up: "+titleOutput;
		}
		console.log(titleOutput);
	}
	//output the divider to start the submenu content
	console.log("---");
	//loop through contents again to compile and present submenu content
	let menuOutput = "";
	for(let i=0;i<contents.length;i++){
		if(contents.length>1){
			menuOutput+=`${contents[i].swiftbar_name}\n`;
		}
		if(contents[i].swiftbar_content.length>1){
			menuOutput+=`${contents[i].swiftbar_content}\n---\n`;
		}
		const x = i+1;
		if(x==contents.length){
			menuOutput+=outputFooter();
		}
	}
	console.log(menuOutput);
}
