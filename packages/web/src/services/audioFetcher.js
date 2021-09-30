import { AUDIO_FETCH_BASE_URL } from '../globals';

function timeout(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}

export async function isOffline() {
  try {
    const res = await timeout(5000, fetch(`${AUDIO_FETCH_BASE_URL}/test`));
    if (res.status !== 200) {
      return true;
    }
  } catch (e) {
    alert(e);
    return true;
  }

  return false;
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
