import { AUDIO_FETCH_BASE_URL } from '../globals';

let offline = null;

export async function isOffline() {
  if (offline === null) {
    const res = await fetch(`${AUDIO_FETCH_BASE_URL}/test`).catch(() => false);
    if (res === false || res.status !== 200) {
      offline = true;
    }
    offline = false;
  }

  return offline;
}

export async function fetchInfo(url) {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/trackinfo?url=${url}`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
  })).json();
}

export async function fetchTrack(url) {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/download?url=${url}`;

  const audioBlob = await (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  })).blob();

  return audioBlob;
}
