import store from '@/store';

const AudioContext = window.AudioContext || window.webkitAudioContext;
let context = new AudioContext();

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

export function free() {
  context = new AudioContext();
}

// TODO: REFACTOR THIS TO HAVE LESS DUPE CODE YOU LAZY BUM
function playAudioId(db, track, curr, end) {
  localStorage.setItem('partNumber', curr);
  const audioId = track.audioIds[curr];
  const theDb = db;
  source = context.createBufferSource();
  if (nextBuffer) {
    source.buffer = nextBuffer;
    source.connect(context.destination);
    source.start();
    if (curr + 1 !== end) {
      const nextAudioId = track.audioIds[curr + 1];
      theDb.transaction(['audio']).objectStore('audio').get(nextAudioId).onsuccess = (ev) => {
        const nextAudioArrayBuffer = ev.target.result.data;
        context.decodeAudioData(nextAudioArrayBuffer, (bufferNext) => {
          nextBuffer = bufferNext;
        });
      };
    }
    source.onended = function () {
      if (curr + 1 === end) {
        theDb.close();
        nextBuffer = null;
        store.dispatch('loadNextTrackAsCurrent');
      } else {
        playAudioId(theDb, track, curr + 1, end);
      }
    };
  } else {
    theDb.transaction(['audio']).objectStore('audio').get(audioId).onsuccess = (e) => {
      const audioArrayBuffer = e.target.result.data;
      context.decodeAudioData(audioArrayBuffer, (buffer) => {
        store.state.hardwarePlayerLoading = false;
        source.buffer = buffer;
        source.connect(context.destination);
        source.start();
        // start decoding next part, store and use buffer
        // this ensures there's no pause/hiccup when playing the next part.
        if (curr + 1 !== end) {
          const nextAudioId = track.audioIds[curr + 1];
          theDb.transaction(['audio']).objectStore('audio').get(nextAudioId).onsuccess = (ev) => {
            const nextAudioArrayBuffer = ev.target.result.data;
            context.decodeAudioData(nextAudioArrayBuffer, (bufferNext) => {
              nextBuffer = bufferNext;
            });
          };
        }
        source.onended = function () {
          if (curr + 1 === end) {
            theDb.close();
            store.dispatch('loadNextTrackAsCurrent');
          } else {
            playAudioId(theDb, track, curr + 1, end);
          }
        };
      }, (err) => {
        alert(err.err);
      });
    };
  }
}

export async function play(track, partNumberStart) {
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
  const request = indexedDB.open('audioFiles');
  request.onsuccess = (event) => {
    const db2 = event.target.result;
    if (track.hasParts) {
      if (partToStart) {
        playAudioId(db2, track, partToStart, track.audioIds.length);
      } else {
        playAudioId(db2, track, 0, track.audioIds.length);
      }
    } else {
      db2.transaction(['audio']).objectStore('audio').get(track.audioId).onsuccess = (e) => {
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
        db2.close();
      };
    }
  };
}

export function pause() {
  context.suspend();
}

export function resume() {
  context.resume();
}
