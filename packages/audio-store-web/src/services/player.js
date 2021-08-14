import store from '@/store';

const request = indexedDB.open('audioFiles');
let db = null;
request.onsuccess = (event) => {
  db = event.target.result;
};

const AudioContext = window.AudioContext || window.webkitAudioContext;
const context = new AudioContext();

let source;

let nextBuffer;

export function stop() {
  if (source) {
    source.onended = () => {};
    source.stop();
    nextBuffer = null;
    source = null;
  }
}

// TODO: REFACTOR THIS TO HAVE LESS DUPE CODE YOU LAZY BUM
function playAudioId(track, curr, end) {
  localStorage.setItem('partNumber', curr);
  const audioId = track.audioIds[curr];
  source = context.createBufferSource();
  if (nextBuffer) {
    source.buffer = nextBuffer;
    source.connect(context.destination);
    source.start();
    if (curr + 1 !== end) {
      const nextAudioId = track.audioIds[curr + 1];
      const transaction = db.transaction(['audio']).objectStore('audio').get(nextAudioId);
      transaction.onsuccess = (ev) => {
        const nextAudioArrayBuffer = ev.target.result.data;
        context.decodeAudioData(nextAudioArrayBuffer, (bufferNext) => {
          nextBuffer = bufferNext;
        }, (err) => {
          alert(err.err);
        });
      };
      transaction.onerror = () => alert('error with indexeddb');
    }
    source.onended = function () {
      if (curr + 1 === end) {
        nextBuffer = null;
        store.dispatch('loadNextTrackAsCurrent');
      } else {
        playAudioId(track, curr + 1, end);
      }
    };
  } else {
    const transaction = db.transaction(['audio']).objectStore('audio').get(audioId);
    transaction.onsuccess = (e) => {
      const audioArrayBuffer = e.target.result.data;
      context.decodeAudioData(audioArrayBuffer, (buffer) => {
        store.state.hardwarePlayerLoading = false;
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        // start decoding next part, store and use buffer
        if (curr + 1 !== end) {
          const nextAudioId = track.audioIds[curr + 1];
          const subTrans = db.transaction(['audio']).objectStore('audio').get(nextAudioId);
          subTrans.onsuccess = (ev) => {
            const nextAudioArrayBuffer = ev.target.result.data;
            context.decodeAudioData(nextAudioArrayBuffer, (bufferNext) => {
              nextBuffer = bufferNext;
            }, (err) => {
              alert(err.err);
            });
          };
          subTrans.onerror = () => alert('error with indexeddb');
        }
        source.onended = function () {
          if (curr + 1 === end) {
            store.dispatch('loadNextTrackAsCurrent');
          } else {
            playAudioId(track, curr + 1, end);
          }
        };
      }, (err) => {
        alert(err.err);
      });
    };
    transaction.onerror = () => alert('error with indexeddb');
  }
}

export async function play(track, partNumberStart) {
  while (db === null) {
    console.log('waiting for db...');
  }

  if (source) {
    stop();
  }

  let partToStart = partNumberStart;

  store.state.hardwarePlayerLoading = true;

  if (localStorage.getItem('trackId')) {
    if (track.id !== parseInt(localStorage.getItem('trackId'), 10)) {
      partToStart = 0;
    }
  }

  localStorage.removeItem('trackId');
  localStorage.removeItem('playlistId');
  localStorage.removeItem('partNumber');

  localStorage.setItem('trackId', track.id);
  localStorage.setItem('playlistId', store.state.currentPlaylistId);

  // have to construct source out here - user action not passed into callback
  source = context.createBufferSource();
  if (track.hasParts) {
    if (partToStart) {
      playAudioId(track, partToStart, track.audioIds.length);
    } else {
      playAudioId(track, 0, track.audioIds.length);
    }
  } else {
    const transaction = db.transaction(['audio']).objectStore('audio').get(track.audioId);
    transaction.onsuccess = (e) => {
      const audioArrayBuffer = e.target.result.data;
      context.decodeAudioData(audioArrayBuffer, (buffer) => {
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        store.state.hardwarePlayerLoading = false;
        source.onended = function () {
          store.dispatch('loadNextTrackAsCurrent');
        };
      }, (err) => {
        alert(err.err);
      });
    };
    transaction.onerror = () => alert('error with indexeddb');
  }
}

export function pause() {
  context.suspend();
}

export function resume() {
  context.resume();
}
