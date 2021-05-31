<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-end">
      <svg @click="openSettings()" class="mt-4 mr-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    </div>
    <div class="text-2xl">Tracks</div>
    <div class="my-4">
      <AddTrack/>
    </div>
    <div class="flex items-start justify-center h-full overflow-y-auto">
      <div class="justify-center max-w-full">
        <Track v-for="track in tracks" :key="track.id" :track="track" @trackLoaded="trackLoaded()"/>
      </div>
    </div>
    <div>
      <Player @trackFail="trackFailed($event)"/>
    </div>
  </div>
</template>

<script>
import AddTrack from '@/components/AddTrack.vue';
import Player from '@/components/Player.vue';
import Track from '@/components/Track.vue';

export default {
  name: 'Home',
  async created() {
    this.$store.dispatch('getTracks');
  },
  components: {
    AddTrack,
    Player,
    Track,
  },
  data() {
    return {
    };
  },
  computed: {
    tracks() {
      return this.$store.getters.tracks;
    },
  },
  methods: {
    trackFailed(failedTrack) {
      const track = this.tracks.find((t) => t.id === failedTrack.id);
      track.loaded = false;
      alert('loading failed');
    },
    openSettings() {
      this.$router.push({ path: 'settings' });
    },
  },
};
</script>
