const fs = require('fs');
const ytdl = require('ytdl-core');
const sanitize = require("sanitize-filename");

const AUDIO_FILES_DIRECTORY = 'audio-files';

let library;
if (!fs.existsSync('library.json')) {
  library = {};
} else {
  library = JSON.parse(fs.readFileSync('library.json'));
}

const download = async (url) => {
  const {videoDetails} = await ytdl.getBasicInfo(url);
  const {title, videoId} = videoDetails;

  if (library[videoId]) {
    return library[videoId].filename;
  }

  return new Promise((res, rej) => {
    const stream = ytdl('https://www.youtube.com/watch?v=N-yhJChOb_g', {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    const filename = `${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]] - ${sanitize(title)}.mp3`;

    stream.on('end', () => {
      Object.assign(library, {
        [videoId]: {
          filename,
        }
      });

      fs.writeFileSync('library.json', JSON.stringify(library));
      res(filename);
    });

    stream.pipe(fs.createWriteStream(filename));
  });
}

module.exports = {
  download,
}
