module.exports = {
	name: 'help',
	execute(message) {
		const sayMessage = `
A bot that can do some random things.

Try:

+help
+ping
+say Is this real life?
+nostalgie
+animegirl
+waifu <category>

> BETA
+codstats <playerName> <platform>


> FAQ

**What's the difference between __+animegirl__ and __+waifu__?**
+animegirl --> random image from Reddit (r/AnimeGirls)
+waifu --> random image from waifu api - SFW only! (waifu.pics) 

**Could the bot do <<cool feature>>?**
Talk to Keldor or code it yourself :) 

--> https://github.com/keldor2k/DiscordBot
`;
		message.channel.send(sayMessage);
  },
};