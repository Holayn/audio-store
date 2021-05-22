const AUDIO_FETCH_BASE_URL = 'http://localhost:8000';
const AUDIO_FETCH_AUDIO_API_PATH = '/file';

export default async function fetchUrl(url) {
  const apiUrl = `${AUDIO_FETCH_BASE_URL}${AUDIO_FETCH_AUDIO_API_PATH}?track=${url}`;

  const audioBlob = await (await fetch(apiUrl)).blob();

  return audioBlob;
}
