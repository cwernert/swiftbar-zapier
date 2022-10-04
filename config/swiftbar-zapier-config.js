#!/usr/bin/env node
import inquirer from 'inquirer';
import fs from 'fs';
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const configdir = path.dirname(__filename);
const configfile	= configdir+"/swiftbar-zapier-config.json";
const defaultconfig = {"channelids":[]};

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
}else{
	console.log("Error: Invalid execution");
	console.log("---");
	console.log("swiftbar-zapier-config.js is used to modify swiftbar-zapier's configuration, and should not be run as a SwiftBar plugin.");
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
		config_ask_next();
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
