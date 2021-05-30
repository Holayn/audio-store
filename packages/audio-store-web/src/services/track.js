import db from './db';
import { fetchInfo, fetchTrack } from './audioFetcher';

export async function getTracks() {
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
        };

        await database.put('tracks', track);
      }
    }

    return track;
  }));
}

export async function createNewTrack(url) {
  const { title, length, videoId } = await fetchInfo(url);
  // find a track with this videoId already - don't add it if it exists.
  const database = await db.getDb();
  const keys = await database.getAllKeys('tracks');
  const res = await Promise.all(keys.map(async (key) => {
    const track = await database.get('tracks', key);

    // verify that audio is really loaded
    if (track.videoId === videoId) {
      return false;
    }

    return true;
  }));
  if (res.includes(false)) {
    alert('track already exists');
    return null;
  }

  const audioBlob = await fetchTrack(url);

  const audioId = await database.add('audio', {
    data: audioBlob,
  });

  const track = {
    title: `${title}`,
    loaded: false,
    dateAdded: Date.now(),
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
  const audioBlob = await fetchTrack(track.url);

  if (!audioBlob) {
    return null;
  }

  const database = await db.getDb();
  const audioId = await database.add('audio', {
    data: audioBlob,
  });

  const updatedTrack = {
    ...track,
    loaded: true,
    audioId,
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
  };

  return updatedTrack;
}
