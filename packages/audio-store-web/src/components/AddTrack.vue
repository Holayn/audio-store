<template>
  <div class="flex flex-col justify-center items-center">
    <div>
      <input type="text" v-model="urlToLoad" class="border text-gray-900" placeholder="yt url">
    </div>
    <div class="mt-4">Add to:</div>
    <select class="mt-4 p-2 bg-gray-300" v-model="playlistId">
      <option v-for="playlistId in playlistIds" :key="playlistId" :value="playlistId">
        {{$store.getters.playlists[playlistId].title}}
      </option>
    </select>
    <button
      type="button"
      @click="loadTrack()"
      class="w-16 h-1/2 mt-4 flex items-center justify-center rounded-md bg-black text-white">
      load
    </button>
    <div v-if="loading" class="flex justify-center pt-16">
      <div
        class="animate-spin rounded-full border-2 border-t-2 border-gray-200 h-8 w-8"
        style="border-top-color: black;"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTrack',
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
