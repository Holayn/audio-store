const fs = require('fs');
const ytdl = require('ytdl-core');
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

/**
 *
 * @param {*} url
 * @param {*} parts if the download should even consider splitting the file into parts
 */
const download = async (url, canSplitIntoParts) => {
  const {videoDetails} = await ytdl.getBasicInfo(url);
  const {title, videoId, lengthSeconds} = videoDetails;

  if (library[videoId]) {
    const { filename } = library[videoId];
    if (canSplitIntoParts && lengthSeconds > 300) {
      // files were downloaded before, so they were deleted
      const parts = await split(filename, videoId);
      return {
        filename,
        parts,
      };
    }
    else {
      return library[videoId];
    }
  }

  return new Promise(async (res, rej) => {
    console.log(`downloading: ${title}`);
    const stream = ytdl(url, {
      quality: 'highestaudio',
      filter: 'audioonly',
    });

    const filename = `${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]].mp3`;

    const proc = ffmpeg({
      source: stream,
    });
    proc.save(filename);
    proc.on('error', (err) => {
      console.log(`err: ${err.message}`);
      rej();
    });
    proc.on('end', async () => {
      console.log('done');

      Object.assign(library, {
        [videoId]: {
          filename,
          title,
        }
      });

      fs.writeFileSync('library.json', JSON.stringify(library));

      // 5 minutes
      if (canSplitIntoParts && lengthSeconds > 300) {
        const parts = await split(filenane, videoId);

        res({
          filename,
          parts,
        });
      } else {
        res({filename});
      }
    });
  });
};

const split = async (filename, videoId) => {
  const numParts = Math.ceil(lengthSeconds / 60);
  const partProc = ffmpeg(filename).outputOptions(['-f segment', '-segment_time 60', '-c copy']).output(`${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]]-[[[%03d]]].mp3`);

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
    parts.push(`${AUDIO_FILES_DIRECTORY}/[[[${videoId}]]]-[[[${getFileNum(i)}]]].mp3`);
  }

  return parts;
}

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
