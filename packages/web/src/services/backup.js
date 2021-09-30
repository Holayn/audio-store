import { isOffline } from './audioFetcher';
import db from './db';
import { AUDIO_FETCH_BASE_URL } from '../globals';

export async function backupTracks() {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const database = await db.getDb();
  const keys = await database.getAllKeys('tracks');
  const tracks = await Promise.all(keys.map(async (key) => database.get('tracks', key)));

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/backupTracks`;
  await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      tracks,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {
    alert('something went wrong');
    throw new Error();
  });
}

export async function backupPlaylists() {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const database = await db.getDb();
  const keys = await database.getAllKeys('playlists');
  const playlists = await Promise.all(keys.map(async (key) => database.get('playlists', key)));

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/backupPlaylists`;
  await fetch(apiUrl, {
    method: 'POST',
    body: JSON.stringify({
      playlists,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {
    alert('something went wrong');
    throw new Error();
  });
}
