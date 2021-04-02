// filesystem
const filesystem = require("fs").promises;

// uuids
const {
	v1: generateUUID // use uuid v1 to generate UUIDs
} = require("uuid");

// suggestion command module
let SuggestionCommands = {};

// get stored suggestions
let suggestions;

// load/refresh suggestions
const loadSuggestions = _ => {
	// read suggestions.json
	(filesystem.readFile("src/suggestions.json")
		.then(data => {
			suggestions = JSON.parse(data);
		})
		.catch(console.err));
};

// load suggestions
loadSuggestions();

// suggestion command: suggestion new
SuggestionCommands["suggestion new"] = message => {
	// generate a UUID for this suggestion
	let uuid = generateUUID();
	
	// append suggestion
	suggestions.push({
		"id": uuid,                           // suggestion id
		"content": message.content.slice(15), // suggestion content
		"votes": 0                            // suggestion popularity
	});

	// log
	console.log("New suggestion:", uuid);

	// reply
	message.reply("Suggestion ID: " + uuid);
};

// suggestion command: suggestion saveall
SuggestionCommands["suggestion saveall"] = message => {
	// save suggestions to src/suggestions.json
	( filesystem.writeFile("src/suggestions.json",
				           JSON.stringify(suggestions) )
		.then(_ => console.log("[SuggestionBot] saved suggestions"))
		.catch(console.error));
	
	// reply
	message.reply("Saved suggestions to src/suggestions.json");
};

// suggestion command: suggestion refresh
SuggestionCommands["suggestion refresh"] = loadSuggestions;

// suggestion command: suggestion vote
SuggestionCommands["suggestion vote"] = message => {
	suggestion.votes = suggestion.votes + 1;
};

// suggestion command: suggestion list
SuggestionCommands["suggestion list"] = message => {
	// sort suggestions by popularity
	suggestions.sort(suggestion => suggestion.votes);

	// if suggestions exist, send them
	if(suggestions.length != 0) {
		// get a list of suggestions
		let suggestionList = "";
		suggestions.forEach(({ id, content }) => {
			// add suggestion to list
			suggestionList += id + ": \"" + content + "\"\n";
		});

		// reply
		message.reply(suggestionList);
	} else {
		// otherwise, reply "no suggestions found"
		message.reply("No suggestions found");
	}
};

// suggestion command: suggestion search
SuggestionCommands["suggestion search"] = message => {
	// variables
	let search_query = message.content.slice(18); // search query; everything after "suggestion search "
	let query_keywords = search_query.split();    // query keywords
	let results = [];                             // result list
	let index;                                    // result index

	// log
	console.log("Searching with query", {
		search_query,
		query_keywords
	});

	// get results
	suggestions.forEach(suggestion => {
		// if suggestion content contains ANY keywords from search_query, append suggestion
		query_keywords.forEach(keyword => {
			if(suggestion.content.includes(keyword)) {
				// increment keywords counter
				suggestion.keywords = (suggestion.keywords || 0) + 1;

				// increment index counter
				index = index + 1;
			}
		});

		// append suggestion to results
		results.push(suggestion);
	});
	// sort results
	results = results.filter(result => {
		return result.keywords > 0;
	});
	results.sort(result => result.keywords);

	// log results
	console.log(results);

	// reply
	if(results.length > 0) {
		// list results
		let reply = "";
		results.forEach(suggestion => {
			// append each suggestion to message
			reply = `${reply}\n{ ID: ${suggestion.id} CONTENT: ${suggestion.content} },`;
		});
		message.reply(reply);
	} else {
		// no results found
		message.reply("No results found :(");
	}
};

// TODO suggestion command: suggestion help

// exports
module.exports = SuggestionCommands;
