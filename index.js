const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require('fs');

// CONFIG
const token = process.env.TOKEN;
const prefix = "+";

// on start
client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  console.log(`Serving ${client.guilds.size} servers`);
  client.user.setActivity(`Halt's Maul! Und schreib +help`);
});

// bot joins a guild / server
client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

// bot is removed from a guild / server
client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("presenceUpdate", (oldMember, newMember) => {
  if(oldMember.user.bot) return;
  console.log(`user update for: ${newMember.displayName}`);
  if(oldMember.presence.status !== newMember.presence.status) {
    console.log(`presenceUpdate: ${oldMember.presence.status} -> ${newMember.presence.status} `);
  }
  if(oldMember.presence.game !== null && oldMember.presence.game !== undefined) {
    console.log(`oldMember - game: ${oldMember.presence.game.name} type: ${oldMember.presence.game.type} `);
  }
  if(newMember.presence.game !== null && newMember.presence.game !== undefined) {
    console.log(`newMember - game: ${newMember.presence.game.name} type: ${newMember.presence.game.type} `);
  }
});

// for every message (channel or DM)
client.on("message", async message => {
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

  if(command === "ping") {
    // Round-trip latency AND average latency between bot and websocket server (one-way)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "help") {
    const sayMessage = "Probier mal:\n\n +würg @user (oder +würgen oder +choke) \n +help \n +nostalgie \n +animegirl \n +ping \n +say Is this real life? \n\n oder bau halt selbst was dazu --> https://github.com/keldor2k/DiscordBot";
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

  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    //message.delete().catch(O_o=>{}); 
    message.delete().catch(console.error); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  if(command === "choke" || command === "würg" || command === "würge" || command === "würgen") {
    if (message.channel.type === "dm") {
      return message.reply('sorry aber Würge-Anfragen mach ich nicht per Direct Message');
    }
    if (!message.mentions.users.size) {
      return message.reply('wer soll gewürgt werden? Tagge einen User mit @');
    }
    if (message.mentions.users.size > 1) {
      return message.reply('bitte würge nur einen User auf einmal.');
    }
    const taggedUser = message.mentions.users.first();
    if (taggedUser.bot) {
      return message.reply('Bots werden nicht gewürgt!');
    }
    message.reply(`ich würge ${taggedUser} für dich 👍 Frag ihn/sie wie es war pls :)`);
    getRandomLine('chokes.csv', function(returnValue){
      taggedUser.send(returnValue);
      return;
    });
  }
  
});

client.login(token);

function getRandomLine(filename,callback){
  fs.readFile(filename, function(err, data){
    if(err) throw err;
    data = data + ''; //converting to string because 'data' is a Location object
    var lines = data.split('\n');
    randomLine = lines[Math.floor(Math.random()*lines.length)];
    callback(randomLine);
 });
  }