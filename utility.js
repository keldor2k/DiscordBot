const fs = require('fs');

const getRandomLine = function(filename, callback) {
	fs.readFile(filename, function(err, data) {
		if(err) throw err;
		data = data + ''; //converting to string because 'data' is a Location object
		const lines = data.split('\n').filter(s => s);
		randomLine = lines[Math.floor(Math.random()*lines.length)];
		callback(randomLine);
	});
}

module.exports = {
	getRandomLine
};