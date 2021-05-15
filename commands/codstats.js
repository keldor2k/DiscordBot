const COD_USERNAME = process.env.COD_USERNAME;
const COD_PASSWORD = process.env.COD_PASSWORD;
const codAPI = require('call-of-duty-api')();
const { MessageEmbed }  = require("discord.js");
const { helpText } = require('../config.json');

module.exports = {
	name: 'codstats',
	async execute(message, args) {
		// Call of Duty API - Dirty Hack <3
		if(!args[0]) {message.channel.send('Enter a gamertag/player name'); return;}
		if(!args[1]) {message.channel.send("Enter a platform (psn, xbl, battle, acti,...)"); return;}
		const m = await message.channel.send("Loading...");
		try {
			await codAPI.login(COD_USERNAME, COD_PASSWORD);
			let data = await codAPI.MWBattleData(args[0], args[1]);
			const embed = new MessageEmbed()
			.setColor('F6FF33')
			.setThumbnail('https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/032020/call_of_duty_warzone.jpg')
			.setTitle('COD Warzone')
			.setDescription('Battle Royal stats overview:')
			.addField('\u200B', '\u200B')
			.addField(`> ${args[0]}`, '\u200B', false)
			.addFields(
				{name: 'Wins', value: data.br.wins, inline: true},
				{name: 'K/D ratio', value: (data.br.kdRatio).toFixed(2), inline: true},
				{name: 'Downs', value: data.br.downs, inline: true},
				{name: 'Score', value: data.br.score, inline: true},
				{name: 'Time Played', value: (parseFloat(data.br.timePlayed) / 3600).toFixed(2) + 'hrs', inline: true},
				{name: 'Games Played', value: data.br.gamesPlayed, inline: true},
				{name: 'Score/min', value: (data.br.scorePerMinute).toFixed(2), inline: true},
				{name: 'Kills', value: data.br.kills, inline: true},
				{name: 'Deaths', value: data.br.deaths, inline: true}
				)
			.addField('\u200B', '\u200B')
			.setFooter(helpText)
			message.channel.send(embed);
			m.delete().catch(console.error);
		} catch(error) {
			m.delete().catch(console.error);
			console.log("error :(")
			if(error.includes('Not permitted: not allowed')) {
				message.channel.send(`Not permitted to access data for ${args[0]}. Maybe profile is private?`);
			} else if (error.includes('404 - Not found. Incorrect username or platform?')) {
				message.channel.send("Player doesn't exist. Incorrect username or platform? Here are some examples: \n> +codstats danielxgold psn\n> +codstats Impact#2524 battle");
			} else {
				console.log(error)
				message.channel.send("Couldn't load player data.");
			}
		}
	},
};