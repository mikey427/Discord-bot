const fs = require('fs');

module.exports = {
  name: 'listen',
  description: 'The bot will join your channel and will take voice commands.',
  async execute (message, args) {
    console.log('listen');
    const user = message.member;
    const voiceChannel = user.voice.channel;
    let connection = await voiceChannel.join();
    message.channel.send('Listening!');
    const audio = await connection.receiver.createStream(message, {
      mode: 'opus',
      end: 'manual'
    });
    console.log('reached here');
    audio.pipe(fs.createWriteStream('user_audio'));
    connection.play(audio, { type: 'opus' });
  }
};
