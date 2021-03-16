const { Client, MessageEmbed }  = require("discord.js");
const client = new Client();
const fs = require('fs');
const codAPI = require('call-of-duty-api')();

// CONFIG
const token = process.env.TOKEN;
const prefix = "+";
const COD_USERNAME = process.env.COD_USERNAME;
const COD_PASSWORD = process.env.COD_PASSWORD;

// on start
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, serving ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds/servers:`); 
  client.guilds.cache.forEach((value, key, map) => console.log(" - ", key, value.name));
  client.user.setActivity(`Halt's Maul! Und schreib +help`);
});

// bot joins a guild / server
client.on('guildCreate', guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Halt's Maul! Und schreib +help`);
  console.log(`Serving ${client.guilds.cache.size} servers`);
});

// bot is removed from a guild / server
client.on('guildDelete', guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

// for every message (channel or DM)
client.on('message', async message => {
  // prevent "botception"
  if(message.author.bot) return;
  
  // ignore messages without 'prefix'
  if(message.content.indexOf(prefix) !== 0) return;
  
  // separate "command" name, and "arguments" for the command.
  // e.g. "+say Is this the real life?"
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(`${message.author.username} wrote: ${message.content}`);

  if(command === 'ping') {
    // Round-trip latency AND average latency between bot and websocket server (one-way)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
  }

  if(command === 'help') {
    const sayMessage = `
Ein Bot der Kleinigkeiten kann.

Probier mal:

+help
+nostalgie
+animegirl
+ping
+say Is this real life?

> BETA
+codstats <playerName> <platform>

oder bau halt selbst was dazu --> https://github.com/keldor2k/DiscordBot
`;
    message.channel.send(sayMessage);
  }
  
  if(command === 'animegirl') {
    getRandomLine('animegirl.csv', function(returnValue){
      message.channel.send(returnValue);
      return;
    });
  }

  if(command === 'nostalgie') {
    getRandomLine('nostalgie.csv', function(returnValue){
      message.channel.send(returnValue);
      return;
    });
  }

  if(command === 'say') {
    const sayMessage = args.join(" ");
    message.delete({ timeout: 2000 })
      .then(msg => console.log(`Deleted message from ${msg.author.username} after 2 seconds`))
      .catch(console.error);
    message.channel.send(sayMessage);
  }

// Call of Duty API - Dirty Hack <3
  if(command === 'codstats') {
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
      .setFooter("❔ - Type '+help' for more information")
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
  }
  
});

client.login(token);

function getRandomLine(filename,callback){
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    data = data + ''; //converting to string because 'data' is a Location object
    const lines = data.split('\n');
    randomLine = lines[Math.floor(Math.random()*lines.length)];
    callback(randomLine);
 });
}