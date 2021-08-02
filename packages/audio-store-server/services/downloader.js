const fs = require('fs');
const ytdl = require('ytdl-core');
const sanitize = require("sanitize-filename");
const ffmpeg = require('fluent-ffmpeg');

const AUDIO_FILES_DIRECTORY = 'audio-files';

let library;
if (!fs.existsSync('library.json')) {
  library = {};
} else {
  library = JSON.parse(fs.readFileSync('library.json'));
}

const getInfo = async (url) => {
  return ytdl.getBasicInfo(url);
}

const download = async (url) => {
  const {videoDetails} = await ytdl.getBasicInfo(url);
  const {title, videoId} = videoDetails;

  if (library[videoId]) {
    return library[videoId].filename;
  }

  return new Promise((res, rej) => {
    const stream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    const filename = `${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]] - ${sanitize(title)}.mp3`;

    const proc = ffmpeg({
      source: stream,
    });
    proc.save(filename);
    proc.on('end', () => {
      console.log('done');
      Object.assign(library, {
        [videoId]: {
          filename,
        }
      });

      fs.writeFileSync('library.json', JSON.stringify(library));
      res(filename);
    });
    proc.on('error', (err) => {
      console.log(`err: ${err.message}`);
    });
  });
}

module.exports = {
  download,
  getInfo,
}
