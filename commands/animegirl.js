const { getRandomLine } = require('../utility.js');

module.exports = {
	name: 'animegirl',
	execute(message) {
		getRandomLine('commands/animegirl.csv', function(returnValue){
			message.channel.send(returnValue);
			return;
		});
	},
};