const yts = require('yt-search');
const ytdl = require('ytdl-core');

const globalQueue = new Map();

module.exports = {
  name: 'play',
  description: 'Plays the song you entered!',
  async execute (message, args) {
    let serverQueue = globalQueue.get(message.guild.id);
    let songSearch = '';
    for (let i = 0; i <= args.length - 1; i++) {
      songSearch = songSearch + ' ' + args[i];
    }
    let videos = await yts(songSearch);
    const song = videos.all[0];
    if (!serverQueue) {
      const queueContract = {
        textChannel: message.channel,
        voiceChannel: message.member.voice.channel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true
      };
      globalQueue.set(message.guild.id, queueContract);
      serverQueue = queueContract;
      serverQueue.songs.push(song);

      try {
        let connection = await serverQueue.voiceChannel.join();
        serverQueue.connection = connection;
        function play (guild, song) {
          if (!song) {
            serverQueue.voiceChannel.leave();
            globalQueue.delete(guild.id);
            return;
          }
          const dispatcher = serverQueue.connection
            .play(ytdl(song.url))
            .on('finish', () => {
              serverQueue.songs.shift();
              play(guild, serverQueue.songs[0]);
            })
            .on('error', error => {
              console.log(error);
            });
          serverQueue.textChannel.send(`Now playing: ${song.title}`);
          serverQueue.connection.dispatcher = dispatcher;
        }
        play(message.guild, serverQueue.songs[0]);
      } catch (error) {
        console.log(error);
        queue.delete(message.guild.id);
        return message.channel.send(error);
      }
    } else {
      serverQueue.songs.push(song);
      globalQueue.set(message.guild.id, serverQueue);
      return message.channel.send(`${song.title} has been added to the queue!`);
    }
    globalQueue.set(message.guild.id, serverQueue);
  },
  globalQueue
};
