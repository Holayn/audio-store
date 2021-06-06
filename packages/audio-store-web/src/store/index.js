import { createStore } from 'vuex';

import {
  createNewTrack,
  getAllTracks,
  getTrack,
  loadTrackAudio,
  unloadTrackAudio,
} from '../services/track';
import {
  createPlaylist,
  getPlaylist,
  getPlaylists,
  updatePlaylist,
} from '../services/playlist';

export default createStore({
  state: {
    currentTrack: {},
    playlists: {},
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
    updatePlaylist(state, playlist) {
      state.playlists[playlist.id] = playlist;
    },
    playlists(state, playlists) {
      state.playlists = playlists;
    },
    newPlaylist(state, playlist) {
      state.playlists[playlist.id] = playlist;
    },
  },
  actions: {
    async getPlaylists({ commit }) {
      const playlists = await getPlaylists();
      commit('playlists', playlists);
    },
    async getPlaylistTracks({ commit, dispatch, getters }, playlistId) {
      if (!getters.playlists) {
        await dispatch('getPlaylists');
      }
      const tracks = await Promise.all(getters.playlists[playlistId].tracks
        .map((trackId) => getTrack(trackId)));
      commit('tracks', tracks);
    },
    async getAllTracks({ commit }) {
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
    async addNewTrack({ commit }, { url, playlistId }) {
      const track = await createNewTrack(url);
      if (playlistId) {
        const playlist = await getPlaylist(playlistId);
        playlist.tracks.push(track.id);
        await updatePlaylist(playlist);
        commit('updatePlaylist', playlist);
      }
    },
    async addNewPlaylist({ commit }, playlistName) {
      const playlist = await createPlaylist(playlistName);
      commit('newPlaylist', playlist);
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
    async removeTrackFromPlaylist({ commit, dispatch, getters }, { playlistId, trackId }) {
      const playlist = getters.playlists[playlistId];
      const newPlaylist = {
        ...playlist,
        tracks: playlist.tracks.filter((playlistTrackId) => playlistTrackId !== trackId),
      };
      await updatePlaylist(newPlaylist);
      commit('updatePlaylist', newPlaylist);
      dispatch('getPlaylistTracks', playlistId);
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
