module.exports = {
  name: 'leave',
  description: 'Will leave the currently joined channel.',
  execute (message, args) {
    message.member.voice.channel.leave();
    message.channel.send('Leaving channel!');
  }
};
