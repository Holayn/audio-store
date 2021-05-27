import { createStore } from 'vuex';

import db from '../services/db';

import { createNewTrack, loadTrackAudio, unloadTrackAudio } from '../services/track';

export default createStore({
  state: {
    currentTrack: {},
    tracks: [],
  },
  mutations: {
    currentTrack(state, track) {
      state.currentTrack = track;
    },
    tracks(state, tracks) {
      state.tracks = tracks;
    },
    track(state, track) {
      for (let i = 0; i < state.tracks.length; i += 1) {
        if (state.tracks[i].id === track.id) {
          state.tracks[i] = track;
          return;
        }
      }

      state.tracks.push(track);
    },
  },
  actions: {
    async getTracks({ commit }) {
      const database = await db.getDb();
      const keys = await database.getAllKeys('tracks');
      const tracks = await Promise.all(keys.map(async (key) => {
        const track = await database.get('tracks', key);
        return track;
      }));
      commit('tracks', tracks);
    },
    async loadCurrentTrack({ commit }, track) {
      if (!track.loaded) {
        const updatedTrack = await loadTrackAudio(track);
        if (!updatedTrack) {
          return;
        }
        commit('currentTrack', updatedTrack);
        commit('track', updatedTrack);
      } else {
        commit('currentTrack', track);
      }
    },
    async unloadTrack({ commit }, track) {
      const updatedTrack = await unloadTrackAudio(track);
      if (!updatedTrack) {
        return;
      }

      commit('track', updatedTrack);
    },
    async fetchTrack({ commit }, url) {
      commit('track', await createNewTrack(url));
    },
    clearTrack({ commit }) {
      commit('currentTrack', null);
    },
  },
  getters: {
    currentTrack(state) {
      return state.currentTrack;
    },
    tracks(state) {
      return state.tracks;
    },
  },
  modules: {
  },
});
