import { createStore } from 'vuex';

import {
  createNewTrack,
  getAllTracks,
  getTrack,
  loadTrackAudio,
  unloadTrackAudio,
} from '../services/track';

export default createStore({
  state: {
    currentTrack: {},
    playlists: {
      1: {
        id: 1,
        tracks: [3, 1],
        title: 'Test Playlist 1',
      },
    },
    tracks: [],
    currentPlaylistId: null,
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
    async getPlaylists({ commit }) {
      // const tracks = await getPlaylists();
      // commit('tracks', tracks);
    },
    async getPlaylistTracks({ commit, getters }, playlistId) {
      const tracks = await Promise.all(getters.playlists[playlistId].tracks
        .map((trackId) => getTrack(trackId)));
      commit('tracks', tracks);
    },
    async getTracks({ commit }) {
      const tracks = await getAllTracks();
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
    async addNewTrack({ commit }, url) {
      const track = await createNewTrack(url);
      if (!track) return;
      commit('track', track);
    },
    clearTrack({ commit }) {
      commit('currentTrack', null);
    },
    async loadNextTrackAsCurrent({ dispatch, state }) {
      let currentTrackIndex = null;
      for (let i = 0; i < state.tracks.length; i += 1) {
        if (state.tracks[i].id === state.currentTrack.id) {
          currentTrackIndex = i;
        }
      }

      if (currentTrackIndex != null && currentTrackIndex + 1 !== state.tracks.length) {
        dispatch('loadCurrentTrack', state.tracks[currentTrackIndex + 1]);
      }
    },
  },
  getters: {
    currentTrack(state) {
      return state.currentTrack;
    },
    playlists(state) {
      return state.playlists;
    },
    tracks(state) {
      return state.tracks;
    },
  },
  modules: {
  },
});
