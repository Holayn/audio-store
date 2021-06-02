import { openDB, deleteDB } from 'idb';

window.dbReset = async () => {
  await deleteDB('audioFiles');
  const newDB = await openDB('audioFiles', 1, {
    async upgrade(database) {
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

  // // populate db with tracks. this should come from a database
  // await newDB.add('tracks', {
  //   title: 'track1',
  //   url: 'http://youtube.com',
  //   audioId: null,
  //   loaded: false,
  //   dateAdded: Date.now(),
  // });
  // await newDB.add('tracks', {
  //   title: 'track2',
  //   url: 'http://youtube.com',
  //   audioId: null,
  //   loaded: false,
  //   dateAdded: Date.now(),
  // });
  // await newDB.add('tracks', {
  //   title: 'track3',
  //   url: 'http://youtube.com',
  //   audioId: null,
  //   loaded: false,
  //   dateAdded: Date.now(),
  // });

  // TODO: remove
  window.db = newDB;

  return newDB;
};

class DB {
  constructor() {
    this.db = this.init();
  }

  getDb() {
    return this.db;
  }

  async init() {
    const newDB = await openDB('audioFiles', 1, {
      async upgrade(database) {
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

        database.createObjectStore('playlists', {
          keyPath: 'id',
          autoIncrement: true,
        });
      },
    });

    this.db = newDB;

    // TODO: remove
    window.db = newDB;

    return newDB;
  }

  async getSizeOfAudioStore() {
    const database = await this.getDb();
    const keys = await database.getAllKeys('tracks');
    const res = await Promise.all(keys.map(async (key) => {
      const track = await database.get('tracks', key);
      return track.size;
    }));

    return res.reduce((acc, curr) => {
      if (curr != null) {
        return acc + curr;
      }

      return acc;
    }, 0);
  }
}

const db = new DB();

export default db;
