const fetch = require('node-fetch');
const { MessageEmbed }  = require("discord.js");
const { prefix, helpText } = require('../config.json');

const waifuCategoriesUrl = 'https://api.waifu.pics/endpoints';
const waifuSfwUrl = 'https://api.waifu.pics/sfw/';
const waifuCmd = 'waifu'

// see waifu api
// https://waifu.pics/
// https://waifu.pics/docs
// https://api.waifu.pics/endpoints
// https://api.waifu.pics/recent
// https://api.waifu.pics/sfw/neko
module.exports = {
	name: waifuCmd,
	async execute(message, args) {
		if(!args[0]) {
			const { sfw } = await fetch(waifuCategoriesUrl).then(response => response.json());
			if(sfw && Array.isArray(sfw) && sfw.length > 0) {
				const waifuCommands = sfw.map(category => prefix + waifuCmd + " "+category).join("\n");
				const embed = new MessageEmbed()
					.setColor(3447003)
					.setThumbnail('https://www.nicepng.com/png/full/161-1618053_neko-girl-png-library-anime-cat-girls-with.png')
					.setTitle('What kind of waifu?')
					.addField('Here are your options:', waifuCommands, true)
					.setFooter(helpText)
				message.channel.send(embed);
			} else {
				message.channel.send('Something is wrong with the waifu api, sorry :O');
			}
			return;
		}

		const category = args[0];
		const { url } = await fetch(waifuSfwUrl+category).then(response => response.json());
		if(url) {
			message.channel.send(url);
		} else {
			message.channel.send("Waifu not found for category '"+category+"' :(\nSee all categories with: " + prefix + waifuCmd);
		}
	},
};