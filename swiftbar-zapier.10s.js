#!/usr/bin/env node
/*
# <xbar.title>SwiftBar for Zapier</xbar.title>
# <xbar.version>v0.1</xbar.version>
# <xbar.author>Christian Wernert</xbar.author>
# <xbar.author.github>cwernert</xbar.author.github>
# <xbar.desc>Displays contents set by a Zapier channel</xbar.desc>
# <xbar.image>https://upload.wikimedia.org/wikipedia/commons/f/fd/Zapier_logo.svg</xbar.image>
# <xbar.dependencies>node</xbar.dependencies>
# <xbar.abouturl>https://github.com/cwernert/swiftbar-zapier</xbar.abouturl>
# <swiftbar.hideAbout>false</swiftbar.hideAbout>
# <swiftbar.hideRunInTerminal>true</swiftbar.hideRunInTerminal>
# <swiftbar.hideLastUpdated>true</swiftbar.hideLastUpdated>
# <swiftbar.hideDisablePlugin>true</swiftbar.hideDisablePlugin>
# <swiftbar.hideSwiftBar>false</swiftbar.hideSwiftBar>
*/

const fetch = require('node-fetch');
const fs = require('fs');
const path = require("path");
const inquirer = require('inquirer');

const configdir		= path.dirname(__dirname)+"/SwiftBar-Configs";
const configfile	= configdir+"/swiftbar-zapier-config.json";
const configscript	= configdir+"/swiftbar-zapier-config.sh";
const defaultconfig = {"channelids":[]};

let fetchingData = false; //this will be true if Swiftbar is calling the Storage API

// check if this script is being called to add new IDs
if(process.env.CONFIG=="true"){
	switch(process.env.METHOD){
		case "adding":
			config_adding_id();
			break;
		case "removing":
			config_removing_id();
			break;
		default:
			console.log(`Error: Invalid config method: ${process.env.METHOD}`);
			break;
	}
}else{ // app is being run by SwiftBar as usual
	let output = "";
	// set up config folder
	try{
		if(!fs.existsSync(configdir)) {
			fs.mkdirSync(configdir);
		}
	}catch(err){
		output = 'Config dir error: ' + error;
		process.exit();
	}
	// check that config file exists
	try{
		if(fs.existsSync(configfile)) {
			// config exists, read it
			const config = JSON.parse(fs.readFileSync(configfile,'utf8'));
			if(!config.channelids.length>0){
				output = "Please add a Channel ID";
			}else{
				// call Storage for each of the Channel IDs to collect the data
				fetchingData = true;
				readChannels(config);
			}
		}else{
			//need to create config
			fs.writeFile(configfile, JSON.stringify(defaultconfig), err => {
				if(err){console.error(err);}
				output = "Please add a Channel ID";
			});
		}
	}catch(error){
		output = 'Config file error: ' + error;
		process.exit();
	}
	// check that config script exists
	try{
		if(!fs.existsSync(configscript)) {
			// need to create the config script
			fs.writeFile(configscript, "#!/usr/bin/env bash\nCONFIG=$1 METHOD=$2 node $3", err => {
				if(err){console.error(err);}
			});
			fs.chmodSync(configscript, 0o755); //set exec permissions
		}
	}catch(error){
		output = 'Config file error: ' + error;
		process.exit();
	}
	//if the plugin is not async calling for Storage data, it can output right now
	if(!fetchingData){
		output+="\n---";
		output+="\nAdd a new Channel ID | bash="+configscript+" param0=true param1=adding param3="+__filename;
		output+="\nRemove a Channel ID | bash="+configscript+" param0=true param1=removing param3="+__filename;
		console.log(output);
	}
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
		console.log(contents[i].swiftbar_title);
	}
	//output the divider to start the submenu content
	console.log("---");
	//loop through contents again to compile and present submenu content
	let menuOutput = "";
	for(let i=0;i<contents.length;i++){
		if(contents.length>1){
			menuOutput+=`${contents[i].swiftbar_name}\n`;
		}
		menuOutput+=`${contents[i].swiftbar_content}\n---\n`;
		const x = i+1;
		if(x==contents.length){
			menuOutput+="\nAdd a new Channel ID | bash="+configscript+" param0=true param1=adding param3="+__filename;
			menuOutput+="\nRemove a Channel ID | bash="+configscript+" param0=true param1=removing param3="+__filename;
			menuOutput+="\nRefresh | refresh=true";
		}
	}
	console.log(menuOutput);
}

function config_adding_id(){
	const questions = [
		{
			type: 'input',
			name: 'channel',
			message: "Please enter a Channel ID:",
		},
	];
	inquirer.prompt(questions).then(answers => {
		if(answers.channel.length>0){
			//read the config file
			const config = JSON.parse(fs.readFileSync(configfile,'utf8'));
			//append the array with this new id
			config.channelids.push(answers.channel);
			//write the config back to the file
			fs.writeFile(configfile, JSON.stringify(config), err => {
				if(err){console.error(err);}
				//let the user know they can crack a beer
				console.log(`Confirmed: Channel ID "${answers.channel}" has been added.`);
				config_ask_next();
			});
		}else{
			console.log("No Channel ID was added.");
			config_ask_next();
		}
	});
}

function config_removing_id(){
	//read the config file
	let config = JSON.parse(fs.readFileSync(configfile,'utf8'));
	if(!config.channelids.length>0){
		console.log("There are currently no Channel IDs in your SwiftBar Zapier Config.");
	}else{
		let choices = config.channelids;
		choices.unshift("Cancel");
		const questions = [
			{
				type: 'list',
				name: 'channel',
				message: "Please select the Channel ID to remove:",
				choices: choices
			}
		];
		inquirer.prompt(questions).then(answers => {
			if((!answers.channel.length>0)||(answers.channel=="Cancel")){
				console.log("No Channel ID was removed.");
				config_ask_next();
			}else{
				//find answers.channel within the config.channelids array
				const index = config.channelids.indexOf(answers.channel);
				//remove it
				config.channelids.splice(index,1);
				//also remove the cancel option
				config.channelids.splice(0,1);
				//write the config file back
				fs.writeFile(configfile, JSON.stringify(config), err => {
					if(err){console.error(err);}
					//let the user know they can crack a beer
					console.log(`Confirmed: Channel ID "${answers.channel}" has been removed.`);
					config_ask_next();
				});
			}
		});
	}
}

function config_ask_next(){
	let choices = [
		{"name": "Exit","value":"exit"},
		{"name": "Add a new Channel ID","value":"add"},
		{"name": "Remove a Channel ID","value":"remove"}
	];
	const questions = [
		{
			type: 'list',
			name: 'next',
			message: "What would you like to do next?",
			choices: choices
		}
	];
	inquirer.prompt(questions).then(answers => {
		switch(answers.next){
			case "exit":
				process.exit();
				break;
			case "add":
				config_adding_id();
				break;
			case "remove":
				config_removing_id();
				break;
			default:
				console.log("Error: Unknown selection.");
				config_ask_next();//maybe this should simply exit
				break;
		}
	});
}