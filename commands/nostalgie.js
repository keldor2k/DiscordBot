const { getRandomLine } = require('../utility.js');

module.exports = {
	name: 'nostalgie',
	execute(message) {
		getRandomLine('commands/nostalgie.csv', function(returnValue){
			message.channel.send(returnValue);
			return;
		});
	},
};