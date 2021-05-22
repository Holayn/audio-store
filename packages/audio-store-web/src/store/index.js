import { createStore } from 'vuex';

import db from '../services/db';

import { createNewTrack, loadTrackAudio } from '../services/track';

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
        commit('currentTrack', updatedTrack);
      } else {
        commit('currentTrack', track);
      }
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
