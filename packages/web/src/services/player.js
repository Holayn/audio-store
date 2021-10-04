import store from '@/store';

const request = indexedDB.open('audioFiles');
let db = null;
request.onsuccess = (event) => {
  db = event.target.result;
};

function createAudioContext() {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;

  let context = new AudioCtor();

  // Check if hack is necessary. Only occurs in iOS6+ devices
  // and only when you first boot the iPhone, or play a audio/video
  // with a different sample rate
  if (context.sampleRate !== 48000) {
    const buffer = context.createBuffer(1, 1, 48000);
    const dummy = context.createBufferSource();
    dummy.buffer = buffer;
    dummy.connect(context.destination);
    dummy.start(0);
    dummy.disconnect();

    context.close(); // dispose old context
    context = new AudioCtor();
  }

  return context;
}

let context = createAudioContext();
window.context = context;

let source = null;

let nextBuffer;

export function stop() {
  if (source) {
    source.onended = () => {};
    source.stop();
    nextBuffer = null;
    source = null;
  }
}

export function resetAudioContext() {
  stop();
  context = createAudioContext();
}

// TODO: REFACTOR THIS TO HAVE LESS DUPE CODE YOU LAZY BUM
function playAudioId(track, curr, end) {
  localStorage.setItem('partNumber', curr);
  const audioId = track.audioIds[curr];
  source = context.createBufferSource();
  if (nextBuffer) {
    context.resume();
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
          alert('error with decoding audio data');
          alert(err);
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
        context.resume();
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
              alert('error with decoding audio data');
              alert(err);
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
        alert('error with decoding audio data');
        alert(err);
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

  if (track.hasParts) {
    if (partToStart) {
      playAudioId(track, partToStart, track.audioIds.length);
    } else {
      playAudioId(track, 0, track.audioIds.length);
    }
  } else {
    const transaction = db.transaction(['audio']).objectStore('audio').get(track.audioId);
    transaction.onsuccess = (e) => {
      source = context.createBufferSource();
      const audioArrayBuffer = e.target.result.data;
      context.decodeAudioData(audioArrayBuffer, (buffer) => {
        context.resume();
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        store.state.hardwarePlayerLoading = false;
        source.onended = function () {
          store.dispatch('loadNextTrackAsCurrent');
        };
      }, (err) => {
        alert('error with decoding audio data');
        alert(err);
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
