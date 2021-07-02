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
  deletePlaylist,
  getPlaylist,
  getPlaylists,
  updatePlaylist,
} from '../services/playlist';

import { isOffline } from '../services/audioFetcher';

export default createStore({
  state: {
    currentTrack: {},
    playlists: {},
    tracks: [],
    currentPlaylistId: null,
  },
  mutations: {
    currentTrack(state, track) {
      window.document.title = track.title;
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
    deletePlaylist(state, playlistId) {
      delete state.playlists[playlistId];
    },
    currentPlaylistId(state, currentPlaylistId) {
      state.currentPlaylistId = currentPlaylistId;
    },
  },
  actions: {
    async getPlaylists({ commit }) {
      const playlists = await getPlaylists();
      commit('playlists', playlists);
    },
    async getPlaylistTracks({ commit, dispatch, getters }, playlistId) {
      if (!getters.playlists[playlistId]) {
        await dispatch('getPlaylists');
      }
      const tracks = await Promise.all(getters.playlists[playlistId].tracks
        .map((trackId) => getTrack(trackId)));
      commit('currentPlaylistId', playlistId);
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
    async deletePlaylist({ commit }, playlistId) {
      await deletePlaylist(playlistId);
      commit('deletePlaylist', playlistId);
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
        const nextTrack = state.tracks[currentTrackIndex + 1];
        // if we're offline and the next track isn't loaded, try finding a track that is loaded
        if (!nextTrack.loaded && await isOffline()) {
          for (let i = currentTrackIndex + 2; i < state.tracks.length; i += 1) {
            if (state.tracks[i].loaded) {
              dispatch('loadCurrentTrack', state.tracks[i]);
              return;
            }
          }
          return;
        }
        dispatch('loadCurrentTrack', nextTrack);
      }
    },
    async loadPrevTrackAsCurrent({ dispatch, state }) {
      let currentTrackIndex = null;
      for (let i = 0; i < state.tracks.length; i += 1) {
        if (state.tracks[i].id === state.currentTrack.id) {
          currentTrackIndex = i;
        }
      }

      if (currentTrackIndex != null && currentTrackIndex - 1 !== -1) {
        dispatch('loadCurrentTrack', state.tracks[currentTrackIndex - 1]);
      }
    },
    async removeTrackFromPlaylist({ commit, dispatch, getters }, { playlistId, trackIndex }) {
      const playlist = getters.playlists[playlistId];
      const newPlaylist = {
        ...playlist,
        tracks: [
          ...playlist.tracks.slice(0, trackIndex),
          ...playlist.tracks.slice(trackIndex + 1),
        ],
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
    currentPlaylist(state) {
      if (state.currentPlaylistId) {
        return state.playlists[state.currentPlaylistId];
      }
      return null;
    },
  },
  modules: {
  },
});
