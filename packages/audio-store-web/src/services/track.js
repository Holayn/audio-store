import db from './db';
import { fetchInfo, fetchTrack } from './audioFetcher';

export async function getAllTracks() {
  const database = await db.getDb();
  const audioIds = await database.getAllKeys('audio');
  const keys = await database.getAllKeys('tracks');
  return Promise.all(keys.map(async (key) => {
    let track = await database.get('tracks', key);

    // verify that audio is really loaded
    if (track.loaded === true) {
      if (!audioIds.includes(track.audioId)) {
        track = {
          ...track,
          loaded: false,
          audioId: null,
          size: null,
        };

        await database.put('tracks', track);
      }
    }

    return track;
  }));
}

export async function getTrack(trackId) {
  const database = await db.getDb();
  return database.get('tracks', trackId);
}

export async function createNewTrack(url) {
  const { title, length, videoId } = await fetchInfo(url);
  // find a track with this videoId already - don't add it if it exists.
  const database = await db.getDb();
  const keys = await database.getAllKeys('tracks');
  const res = await Promise.all(keys.map(async (key) => {
    const track = await database.get('tracks', key);

    if (track.videoId === videoId) {
      return track;
    }

    return null;
  }));

  for (let i = 0; i < res.length; i += 1) {
    const track = res[i];
    if (track != null) {
      console.log('track already exists');
      return track;
    }
  }

  const audioArrayBuffer = await fetchTrack(url);

  const audioId = await database.add('audio', {
    data: audioArrayBuffer,
  });

  const track = {
    title: `${title}`,
    loaded: true,
    dateAdded: Date.now(),
    size: audioArrayBuffer.byteLength,
    url,
    audioId,
    videoId,
  };

  const trackId = await database.add('tracks', track);

  return {
    id: trackId,
    ...track,
  };
}

export async function loadTrackAudio(track) {
  const audioArrayBuffer = await fetchTrack(track.url);

  if (!audioArrayBuffer) {
    return null;
  }

  const database = await db.getDb();
  const audioId = await database.add('audio', {
    data: audioArrayBuffer,
  });

  const updatedTrack = {
    ...track,
    loaded: true,
    audioId,
    size: audioArrayBuffer.byteLength,
  };

  await database.put('tracks', updatedTrack);

  return updatedTrack;
}

export async function unloadTrackAudio(track) {
  const database = await db.getDb();
  await database.delete('audio', track.audioId);

  const updatedTrack = {
    ...track,
    loaded: false,
    audioId: null,
    size: null,
  };

  await database.put('tracks', updatedTrack);

  return updatedTrack;
}
