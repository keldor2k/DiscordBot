const fs = require('fs');
const Discord = require('discord.js');
const { prefix, helpText } = require('./config.json');
// TODO move token to config
const token = process.env.TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log('Ready!');
  console.log(`Logged in as ${client.user.tag}!`);
  console.log(`Bot has started, serving ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds/servers:`); 
  client.guilds.cache.forEach((value, key, map) => console.log(" - ", key, value.name));
  client.user.setActivity(helpText);
});

// client.on('guildCreate', guild => {
//   console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
//   client.user.setActivity(helpText);
//   console.log(`Serving ${client.guilds.cache.size} servers`);
// });

// client.on('guildDelete', guild => {
//   console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
// });

client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  console.log(`${message.author.username} wrote: ${message.content}`);
  if (!client.commands.has(command)) return;
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
});

client.login(token);