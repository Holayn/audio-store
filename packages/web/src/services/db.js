import { openDB, deleteDB } from 'idb';
import { getPlaylists, getTracks } from './fetcher';

class DB {
  constructor() {
    this.db = this.init();
  }

  getDb() {
    return this.db;
  }

  async delete() {
    await deleteDB('audioFiles', {
      blocked() {
        window.location.reload();
      },
    });
  }

  async init() {
    let isNew = false;
    const newDB = await openDB('audioFiles', 1, {
      async upgrade(database) {
        isNew = true;
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

    if (isNew) {
      const tracks = await getTracks();
      await Promise.all(tracks.map(async (track) => {
        await newDB.add('tracks', {
          ...track,
          dateAdded: Date.now(),
          loaded: false,
        });
      }));

      const playlists = await getPlaylists();
      await Promise.all(playlists.map(async (playlist) => {
        await newDB.add('playlists', playlist);
      }));
    }

    this.db = newDB;

    // TODO: remove
    window.db = this;

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
