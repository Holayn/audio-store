<template>
  <div class="flex items-center justify-center bg-gray-900">
    <div>
      <svg @click="prev()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
    </div>
    <audio ref="audio-elem" @ended="onEnd()" autoplay controls>
      <source v-if="audioData" :src="audioUrl" type="audio/mpeg">
    </audio>
    <div>
      <svg @click="next()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
    </div>
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
        this.$emit('track-fail', track);
      }
    },
    next() {
      this.$store.dispatch('loadNextTrackAsCurrent');
    },
    onEnd() {
      this.$store.dispatch('loadNextTrackAsCurrent');
    },
    prev() {
      this.$store.dispatch('loadPrevTrackAsCurrent');
    },
  },
};
</script>
