<template>
  <div>
    <div class="text-2xl">Tracks</div>
    <div class="flex items-start justify-center overflow-y-auto">
      <div class="justify-center max-w-full">
        <Track v-for="track in tracks" :key="track.id" :track="track" @trackLoaded="trackLoaded()"/>
      </div>
    </div>
  </div>
</template>

<script>
import Track from '@/components/Track.vue';

export default {
  name: 'Home',
  async created() {
    this.$store.dispatch('getTracks');
  },
  components: {
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
