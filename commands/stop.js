const { globalQueue } = require('./play');

module.exports = {
  name: 'stop',
  description: 'Stop playing music',
  execute (message, args) {
    serverQueue = globalQueue.get(message.guild.id);
    serverQueue.songs = [];
    globalQueue.set(message.guild.id, serverQueue);
    serverQueue.connection.dispatcher.end();
    message.channel.send('Music stopped!');
  }
};
