<template>
  <div>
    <div class="flex items-start justify-center h-full overflow-y-auto">
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
  components: {
    Track,
  },
  data() {
    return {
    };
  },
  async created() {
    this.$store.dispatch('getTracks');
  },
  computed: {
    tracks() {
      return this.$store.getters.tracks;
    },
  },
  methods: {
  },
};
</script>
