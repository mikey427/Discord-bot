const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = process.env.prefix;
const fs = require('fs');
client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync('./commands')
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the export module
  client.commands.set(command.name, command);
}

const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once('ready', () => {
  console.log('Ready!');
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
