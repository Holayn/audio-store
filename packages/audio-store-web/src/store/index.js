import { createStore } from 'vuex';
import { DOCUMENT_TITLE } from '../globals';

import {
  createNewTrack,
  getAllTracks,
  getTrack,
  loadTrackAudio,
  unloadTrackAudio,
  deleteTrack,
} from '../services/track';
import {
  createPlaylist,
  deletePlaylist,
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
    hardwarePlayerLoading: false,
  },
  mutations: {
    currentTrack(state, track) {
      if (track) {
        window.document.title = track.title;
      } else {
        window.document.title = DOCUMENT_TITLE;
      }

      // Handle current track being set to currently playing
      state.currentTrack = null;
      setTimeout(() => {
        state.currentTrack = track;
      });
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
    async loadTrack({ commit }, track) {
      const updatedTrack = await loadTrackAudio(track);
      if (!updatedTrack) {
        alert('something went wrong loading the audio');
        return;
      }
      commit('track', updatedTrack);
    },
    loadCurrentTrack({ commit }, track) {
      commit('currentTrack', track);
    },
    async unloadTrack({ commit }, track) {
      const updatedTrack = await unloadTrackAudio(track);
      if (!updatedTrack) {
        return;
      }

      commit('track', updatedTrack);
    },
    async addNewTrack({ commit }, { url, playlistId }) {
      const res = await createNewTrack(url);
      if (playlistId) {
        if (res.playlist) {
          const playlist = await getPlaylist(playlistId);
          playlist.tracks = [
            ...playlist.tracks,
            ...res.tracks.map(({ id }) => id),
          ];
          await updatePlaylist(playlist);
          commit('updatePlaylist', playlist);
        } else {
          const track = res;
          const playlist = await getPlaylist(playlistId);
          playlist.tracks.push(track.id);
          await updatePlaylist(playlist);
          commit('updatePlaylist', playlist);
        }
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
        for (let i = currentTrackIndex + 1; i < state.tracks.length; i += 1) {
          if (state.tracks[i].loaded) {
            dispatch('loadCurrentTrack', state.tracks[i]);
            return;
          }
        }
      }
      dispatch('clearTrack');
    },
    async loadPrevTrackAsCurrent({ dispatch, state }) {
      let currentTrackIndex = null;
      for (let i = 0; i < state.tracks.length; i += 1) {
        if (state.tracks[i].id === state.currentTrack.id) {
          currentTrackIndex = i;
        }
      }

      if (currentTrackIndex != null && currentTrackIndex - 1 !== -1) {
        for (let i = currentTrackIndex - 1; i >= 0; i -= 1) {
          if (state.tracks[i].loaded) {
            dispatch('loadCurrentTrack', state.tracks[i]);
            return;
          }
        }
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
    async removeTrack({ commit, dispatch, getters }, track) {
      // remove track from all playlists
      const { playlists } = getters;
      await Promise.all(Object.keys(playlists).map(async (playlistId) => {
        const { tracks } = playlists[playlistId];
        const trackIndex = tracks.findIndex((playlistTrack) => playlistTrack.id === track.id);
        if (trackIndex) {
          await dispatch('removeTrackFromPlaylist', {
            playlistId,
            trackIndex,
          });
        }
      }));

      await deleteTrack(track);
      const trackIndex = getters.tracks.findIndex((allTrack) => allTrack.id === track.id);
      const newTracks = [
        ...getters.tracks.slice(0, trackIndex),
        ...getters.tracks.slice(trackIndex + 1),
      ];
      commit('tracks', newTracks);
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
    currentTrackLoaded(state) {
      return Object.keys(state.currentTrack).length > 0;
    },
  },
  modules: {
  },
});
