const AUDIO_FETCH_BASE_URL = 'http://192.168.0.133:8000';
const AUDIO_FETCH_AUDIO_API_PATH = '/download';
const AUDIO_FETCH_AUDIO_INFO_PATH = '/trackinfo';
const AUDIO_FETCH_TEST_PATH = '/test';

export async function isOffline() {
  const res = await fetch(`${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_TEST_PATH}`).catch(() => false);
  if (res === false || res.status !== 200) {
    return true;
  }
  return false;
}

export async function fetchInfo(url) {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_AUDIO_INFO_PATH}?url=${url}`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
  })).json();
}

export async function fetchTrack(url) {
  if (await isOffline()) {
    alert('offline - cannot perform action');
    throw new Error();
  }

  const apiUrl = `${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_AUDIO_API_PATH}?url=${url}`;

  const audioBlob = await (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
    throw new Error();
  })).blob();

  return audioBlob;
}
