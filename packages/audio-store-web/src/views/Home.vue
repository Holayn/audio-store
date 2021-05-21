<template>
  <div class="flex flex-col h-full">
    <div class="3xl py-4">Tracks</div>
    <div class="mb-4">
      <AddTrack/>
    </div>
    <div class="flex items-start justify-center h-full overflow-y-auto">
      <div class="justify-center w-2/3">
        <Track v-for="track in tracks" :key="track.id" :track="track" @trackLoaded="trackLoaded()"/>
      </div>
    </div>
    <div>
      <Player @trackFail="trackFailed(event)"/>
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
  },
};
</script>
