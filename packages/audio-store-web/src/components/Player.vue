<template>
  <div class="flex items-center justify-center">
    <audio ref="audio-elem" autoplay controls>
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
    async loadTrack(track) {
      if (!track) {
        return;
      }

      try {
        const { data: audioData } = await db.getDb().get('audio', this.track.audioId);

        if (this.audioData) {
          this.audioData = audioData;
          this.$refs['audio-elem'].load();
        } else {
          this.audioData = audioData;
        }
      } catch (e) {
        this.$store.dispatch('clearTrack');
        this.$emit('track-fail');
      }
    },
  },
};
</script>
