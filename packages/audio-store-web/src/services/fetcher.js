import { isOffline } from './audioFetcher';
import { AUDIO_FETCH_BASE_URL } from '../globals';

export async function getTracks() {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/tracks`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  })).json();
}

export async function getPlaylists() {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/playlists`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  })).json();
}
