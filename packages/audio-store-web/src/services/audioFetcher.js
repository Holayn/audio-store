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

export async function fetchPart(partFilename) {
  const apiUrl = `${AUDIO_FETCH_BASE_URL}/download-part?part=${partFilename}`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  })).arrayBuffer();
}

export async function fetchTrack(url) {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}/download?url=${url}`;

  const res = await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  });

  if (res.headers.get('Content-Type') === 'application/json; charset=utf-8') {
    const { parts } = await res.json();
    return {
      parts: await Promise.all(parts.map((part) => fetchPart(part))),
    };
  }

  return res.arrayBuffer();
}
