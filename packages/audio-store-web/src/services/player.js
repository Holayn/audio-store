import store from '@/store';

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let source;

export function stop() {
  source.onended = () => {};
  source.stop();
  source = null;
}

export async function play(track) {
  if (source) {
    stop();
  }
  // Can't use await syntax on iOS because https://developer.chrome.com/blog/new-in-chrome-72/#user-activation
  // User action not passed through await / Promises
  source = context.createBufferSource();
  const request = indexedDB.open('audioFiles');
  request.onsuccess = (event) => {
    const db2 = event.target.result;
    db2.transaction(['audio']).objectStore('audio').get(track.audioId).onsuccess = (e) => {
      const audioArrayBuffer = e.target.result.data;
      context.decodeAudioData(audioArrayBuffer, (buffer) => {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        source.onended = function () {
          store.dispatch('loadNextTrackAsCurrent');
        };
      }, (err) => {
        alert(err.err);
      });
      db2.close();
    };
  };
}

export function pause() {
  context.suspend();
}

export function resume() {
  context.resume();
}
