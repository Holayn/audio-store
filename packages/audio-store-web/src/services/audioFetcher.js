const AUDIO_FETCH_BASE_URL = 'http://192.168.0.133:8000';
const AUDIO_FETCH_AUDIO_API_PATH = '/download';
const AUDIO_FETCH_AUDIO_INFO_PATH = '/trackinfo';

export async function fetchInfo(url) {
  const apiUrl = `${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_AUDIO_INFO_PATH}?url=${url}`;
  return (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
  })).json();
}

export async function fetchTrack(url) {
  const apiUrl = `${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_AUDIO_API_PATH}?url=${url}`;

  const audioBlob = await (await fetch(apiUrl).catch(() => {
    alert('something went wrong');
  })).blob();

  return audioBlob;
}
