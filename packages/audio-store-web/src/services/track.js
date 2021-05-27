import db from './db';
import fetchUrl from './audioFetcher';

export async function createNewTrack(url) {
  const audioBlob = fetchUrl(url);

  const database = await db.getDb();
  const audioId = await database.add('audio', {
    data: audioBlob,
  });

  const track = {
    title: `track${Date.now()}`,
    loaded: false,
    dateAdded: Date.now(),
    url,
    audioId,
  };

  const trackId = await database.add('tracks', track);

  return {
    id: trackId,
    ...track,
  };
}

export async function loadTrackAudio(track) {
  const audioBlob = await fetchUrl(track.url);

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
