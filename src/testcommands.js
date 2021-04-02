// test command module
let TestCommands = {};

// test command: /ping
TestCommands.ping = message => {
	// reply
	message.reply("pong");
};

// exports
module.exports = TestCommands;
