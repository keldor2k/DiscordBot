const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');

// CONFIG
const token = process.env.TOKEN;
const prefix = "+";

// on start
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds/servers.`); 
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
    const sayMessage = "Probier mal:\n\n +help \n +nostalgie \n +animegirl \n +ping \n +say Is this real life? \n\n oder bau halt selbst was dazu --> https://github.com/keldor2k/DiscordBot";
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
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Delete a message
    message.delete({ timeout: 2000 })
      .then(msg => console.log(`Deleted message from ${msg.author.username} after 2 seconds`))
      .catch(console.error);
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
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