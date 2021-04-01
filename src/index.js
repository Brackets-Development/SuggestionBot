// configuration
const Config = require('./config.json');

// discord API
const Discord = require('discord.js');

// discord API objects
let client; // discord client

// bot objects
let bot = {
	commands: {}
};

// command: /pi	ng
bot.commands.ping = message => {
	// reply
	message.reply("pong");
};

// bot setup function
bot.setup = () => {
	// initialize discord client
	client = new Discord.Client();

	// log
	console.log("Logging into discord bot with key:", Config.client_key);

	// login with client
	client.login(Config.client_key)
		.then(console.log)
		.catch(console.error);
};

// bind bot events
bot.bind = () => {
	// on ready
	client.once('ready', () => {
		// log
		console.log("SuggestionBot online");
		console.log("Username detected:", client.user.tag);
	});

	// on message
	client.on('message', message => {
		// match message command
		for(let [key, command_function] of Object.entries(bot.commands)) {
			// attempt to match command
			if(message.content === key) {
				// log
				console.log("Matched command:", key);
				console.log("Running associated function", command_function);

				// command matched
				command_function(message);
			}
		}
	});
};

// start bot
bot.start = () => {
	// configure bot
	bot.setup();
	bot.bind();
}

// run bot
bot.start();
