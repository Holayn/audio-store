const fs = require('fs');
const ytdl = require('ytdl-core');
const sanitize = require("sanitize-filename");
const ffmpeg = require('fluent-ffmpeg');
const ytpl = require('ytpl');

const AUDIO_FILES_DIRECTORY = 'audio-files';

let library;
if (!fs.existsSync('library.json')) {
  library = {};
} else {
  library = JSON.parse(fs.readFileSync('library.json'));
}

const getPlaylist = async (url) => {
  return ytpl(url);
}

const getInfo = async (url) => {
  try {
    const playlist = await getPlaylist(url);
    return {
      playlist: true,
      tracks: playlist.items.map(({title, id, shortUrl}) => ({
        title,
        videoId: id,
        url: shortUrl,
      })),
    }
  } catch (e) {
    return ytdl.getBasicInfo(url);
  }
};

const download = async (url) => {
  const {videoDetails} = await ytdl.getBasicInfo(url);
  const {title, videoId, lengthSeconds} = videoDetails;

  if (library[videoId]) {
    return library[videoId];
  }

  return new Promise(async (res) => {
    const stream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    const filename = `${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]] - ${sanitize(title)}.mp3`;

    const proc = ffmpeg({
      source: stream,
    });
    proc.save(filename);
    proc.on('error', (err) => {
      console.log(`err: ${err.message}`);
    });
    proc.on('end', async () => {
      console.log('done');
      // 5 minutes
      if (lengthSeconds > 300) {
        // split into 2 minute chunks
        const numParts = Math.ceil(lengthSeconds / 120);
        const partProc = ffmpeg(filename).outputOptions(['-f segment', '-segment_time 120', '-c copy']).output(`${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]] - ${sanitize(title)} - [[[%03d]]].mp3`);

        partProc.run();
        await new Promise(
          (partRes) => {
            partProc.on('end', () => {
              console.log('splitting done');
              partRes();
            });
            partProc.on('error', (e) => {
              console.log(e);
            });
          }
        );

        const parts = [];
        for (let i = 0; i < numParts; i += 1) {
          parts.push(`${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]] - ${sanitize(title)} - [[[${getFileNum(i)}]]].mp3`);
        }

        Object.assign(library, {
          [videoId]: {
            filename,
            parts,
          }
        });

        res({
          filename,
          parts,
        });
      } else {
        Object.assign(library, {
          [videoId]: {
            filename,
          }
        });
      }


      fs.writeFileSync('library.json', JSON.stringify(library));
      res({filename});
    });
  });
};

const getFileNum = (num) => {
  let str = `${num}`;
  while (str.length < 3) {
    str = `0${str}`;
  }
  return str;
};

module.exports = {
  download,
  getInfo,
}
