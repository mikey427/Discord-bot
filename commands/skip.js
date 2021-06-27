const { globalQueue } = require('./play');

module.exports = {
  name: 'skip',
  description: 'Skip the current song',
  execute (message, args) {
    serverQueue = globalQueue.get(message.guild.id);

    if (!message.member.voice.channel)
      return message.channel.send(
        'You have to be in the voice channel to skip the song!'
      );

    if (!serverQueue)
      return message.channel.send('There is no music playing to skip!');
    message.channel.send('Song skipped!');
    serverQueue.connection.dispatcher.end();
  }
};
