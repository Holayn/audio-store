<template>
  <div class="flex flex-col h-full w-full">
    <div class="flex flex-col flex-auto justify-end items-center w-full h-1/2">
      <div>
        <input type="text" v-model="urlToLoad" class="border text-gray-900 p-1 rounded" placeholder="yt track/playlist url">
      </div>
      <select class="mt-4 p-2 bg-gray-300 text-gray-600 w-1/2 rounded" v-model="playlistId">
        <option :value="null" disabled>add to playlist...</option>
        <option v-for="playlistId in playlistIds" :key="playlistId" :value="playlistId">
          {{$store.getters.playlists[playlistId].title}}
        </option>
      </select>
      <button
        type="button"
        @click="loadTrack()"
        class="w-16 p-2 mt-4 flex items-center justify-center rounded-md bg-black text-white">
        load
      </button>
    </div>
    <div class="flex-auto h-1/2">
      <div class="flex justify-center m-16">
        <Loading v-if="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue';

export default {
  name: 'AddTrack',
  components: {
    Loading,
  },
  data() {
    return {
      urlToLoad: '',
      playlistId: null,
      loading: false,
    };
  },
  props: {
  },
  async created() {
    this.$store.dispatch('getPlaylists');
  },
  computed: {
    playlistIds() {
      if (!this.$store.getters.playlists) {
        return [];
      }
      return Object.keys(this.$store.getters.playlists);
    },
  },
  methods: {
    async loadTrack() {
      this.loading = true;
      await this.$store.dispatch('addNewTrack', {
        url: this.urlToLoad,
        playlistId: this.playlistId,
      });
      this.loading = false;
      this.$router.push({
        name: 'Playlist',
        params: {
          id: this.playlistId,
        },
      });
    },
  },
};
</script>
