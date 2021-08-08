<template>
  <div>
    <div class="text-2xl truncate">{{title}}</div>
    <div class="flex justify-center m-2">
      <svg @click="toggleMenu()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
    <div v-if="showMenu" class="mb-2">
      <button
        type="button"
        @click="deletePlaylist()"
        class="mx-1 w-16 rounded-md bg-black text-white">
        delete
      </button>
    </div>
    <div class="flex items-start justify-center overflow-y-auto">
      <div class="justify-center max-w-full w-full">
        <Track
          v-for="(track, index) in tracks"
          :key="track.id"
          :track="track"
          @trackLoaded="trackLoaded()"
          @remove="removeTrack(index)"/>
      </div>
    </div>
  </div>
</template>

<script>
import Track from '@/components/Track.vue';

export default {
  name: 'Home',
  props: ['id'],
  async created() {
    this.$store.dispatch('getPlaylistTracks', this.id);
  },
  components: {
    Track,
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: {
    title() {
      if (!this.$store.getters.playlists[this.id]) {
        return null;
      }
      return this.$store.getters.playlists[this.id].title;
    },
    tracks() {
      return this.$store.getters.tracks;
    },
  },
  methods: {
    deletePlaylist() {
      if (window.confirm('Delete playlist?')) {
        this.$store.dispatch('deletePlaylist', parseInt(this.id, 10));
        this.$router.push({ name: 'Collection' });
      }
    },
    removeTrack(trackIndex) {
      if (this.id) {
        this.$store.dispatch('removeTrackFromPlaylist', {
          playlistId: this.id,
          trackIndex,
        });
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    trackFailed(failedTrack) {
      const track = this.tracks.find((t) => t.id === failedTrack.id);
      track.loaded = false;
      alert('loading failed');
    },
  },
};
</script>
