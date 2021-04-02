// command modules
let SuggestionCommands = require("./suggestioncommands.js"); // suggestion commands
let TestCommands = require("./testcommands.js");             // test commands

// module list
let modules = [ SuggestionCommands, TestCommands ];

// bot command module
let BotCommands = {};

// assign commands to given array
BotCommands.assign = target => {
	// assign each modules commands to target
	modules.forEach(module => {
		// assign current module's commands to target
		for(let [key, command_function] of Object.entries(module))
			target[key] = command_function;
	});
};

// export BotCommands module
module.exports = BotCommands;
