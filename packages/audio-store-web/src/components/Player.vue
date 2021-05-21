<template>
  <div class="flex items-center justify-center">
    <audio autoplay controls>
      <source v-if="audioData" :src="audioUrl" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
import db from '@/services/db';

export default {
  name: 'Player',
  data() {
    return {
      // track: this.$store.state.currentTrack,
      audioData: null,
    };
  },
  props: {
  },
  computed: {
    track() {
      return this.$store.getters.currentTrack;
    },
    audioUrl() {
      if (this.audioData) {
        return URL.createObjectURL(this.audioData);
      }
      return null;
    },
  },
  watch: {
    track(track) {
      this.loadTrack(track);
    },
  },
  methods: {
    async loadTrack() {
      try {
        const { data: audioData } = await db.getDb().get('audio', this.track.audioId);

        this.audioData = audioData;
      } catch (e) {
        this.$emit('track-fail');
      }
    },
  },
};
</script>
