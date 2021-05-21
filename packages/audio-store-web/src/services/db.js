import { openDB, deleteDB } from 'idb';

class DB {
  constructor() {
    this.db = this.init();
  }

  getDb() {
    return this.db;
  }

  async init() {
    await deleteDB('audioFiles');
    const newDB = await openDB('audioFiles', 1, {
      upgrade(database) {
        database.createObjectStore('audio', {
          // The 'id' property of the object will be the key.
          keyPath: 'id',
          // If it isn't explicitly set, create a value by auto incrementing.
          autoIncrement: true,
        });

        database.createObjectStore('tracks', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    });

    const audioBlob = await (await fetch('http://localhost:8000/file')).blob();

    await newDB.add('tracks', {
      title: 'track1',
      url: 'http://youtube.com',
      audioId: 1,
      loaded: false,
      dateAdded: Date.now(),
    });
    await newDB.add('tracks', {
      title: 'track2',
      url: 'http://youtube.com',
      audioId: 1,
      loaded: false,
      dateAdded: Date.now(),
    });
    await newDB.add('tracks', {
      title: 'track3',
      url: 'http://youtube.com',
      audioId: 1,
      loaded: false,
      dateAdded: Date.now(),
    });
    await newDB.add('audio', {
      data: audioBlob,
    });

    this.db = newDB;

    // TODO: remove
    window.db = newDB;

    return newDB;
  }

  async fetchUrlAndAddToDB(url) {
    const audioBlob = await (await fetch('http://localhost:8000/file')).blob();

    const database = await this.getDb();
    const audioId = await database.add('audio', {
      data: audioBlob,
    });

    const track = {
      title: `track${Date.now()}`,
      loaded: false,
      dateAdded: Date.now(),
      url,
      audioId,
    };

    const trackId = await database.add('tracks', track);

    return {
      id: trackId,
      ...track,
    };
  }
}

const db = new DB();

export default db;

// export default async function init() {
//   await deleteDB('audioFiles');
//   const newDB = await openDB('audioFiles', 1, {
//     upgrade(database) {
//       database.createObjectStore('audio', {
//         // The 'id' property of the object will be the key.
//         keyPath: 'id',
//         // If it isn't explicitly set, create a value by auto incrementing.
//         autoIncrement: true,
//       });

//       database.createObjectStore('tracks', {
//         keyPath: 'id',
//         autoIncrement: true,
//       });
//     },
//   });

//   const audioBlob = await (await fetch('http://localhost:8000/file')).blob();

//   await newDB.add('tracks', {
//     title: 'track1',
//     audioId: 1,
//     dateAdded: Date.now(),
//   });
//   await newDB.add('audio', {
//     data: audioBlob,
//   });

//   // TODO: remove
//   window.db = newDB;

//   return newDB;
// }
