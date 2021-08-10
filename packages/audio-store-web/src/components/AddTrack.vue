<template>
  <div class="flex flex-col justify-center items-center w-full">
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
    <div v-if="loading" class="flex justify-center pt-16">
      <Loading/>
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
