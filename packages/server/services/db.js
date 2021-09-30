const mongoose = require('mongoose');

require('dotenv').config();

function modelFactory(name, properties, collection) {
  const schema = new mongoose.Schema(properties, { collection });
  const model = mongoose.model(name, schema);
  return model;
}

class DB {
  connection;
  trackModel;

  constructor() {
    this.trackModel = modelFactory('Track', {
      id: Number,
      title: String,
      url: String,
      videoId: String,
    }, 'tracks');

    this.playlistModel = modelFactory('Playlist', {
      id: Number,
      title: String,
      tracks: Array,
    }, 'playlists');

    this.connect();
  }

  async connect() {
    if (this.connection) {
      return this.connection;
    }
    try {
      this.connection = await mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.info('connected to db');
    } catch (e) {
      throw new Error(`something went wrong trying to connect to the db: ${e}`);
    }
  }

  async execute(cb) {
    try {
      if (!this.connection) {
        await this.connect();
      }

      return cb();
    } catch (e) {
      throw new Error(`something went wrong with fetching: ${e}`);
    }
  }

  async getTracks() {
    return this.execute(async () => {
      const queryTracks = await this.trackModel.find({});
      return queryTracks;
    });
  }

  async backupTracks(payload) {
    const {tracks} = payload;
    await this.trackModel.deleteMany({});
    return Promise.all(tracks.map((track) => {
      return this.execute(() => {
        return new Promise((res, rej) => {
          const newTrack = new this.trackModel(track);
          newTrack.save((err) => {
            if (err) {
              rej();
              return console.error(err);
            }

            res();
          });
        });
      });
    }));
  }

  async getPlaylists() {
    return this.execute(async () => {
      return await this.playlistModel.find({});
    });
  }

  async backupPlaylists(payload) {
    const {playlists} = payload;
    await this.playlistModel.deleteMany({});
    return Promise.all(playlists.map((playlist) => {
      return this.execute(() => {
        return new Promise((res, rej) => {
          const newPlalyist = new this.playlistModel(playlist);
          newPlalyist.save((err) => {
            if (err) {
              rej();
              return console.error(err);
            }

            res();
          });
        });
      });
    }));
  }
}

module.exports = DB;