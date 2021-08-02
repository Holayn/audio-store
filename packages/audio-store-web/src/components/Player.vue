<template>
  <div :class="containerClass">
    <div v-if="isDriveMode" class="flex flex-auto flex-col bg-white">
      <div>
        <svg @click="driveMode()" class="m-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
      <DriveMode
        class="flex flex-auto"
        @togglePlay="togglePlay()"
        @previous="prev()"
        @next="next()"
        @restart="restart()"
        :track="track"
      />
    </div>
    <div class="flex items-center justify-center bg-gray-900 py-4">
      <PlayerButton @click="prev()" class="mx-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
      </PlayerButton>
      <PlayerButton @click="togglePlay()" class="mx-1">
        <svg v-if="!this.isPlaying" class="relative" style="left: 2px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
      </PlayerButton>
      <PlayerButton @click="next()" class="mx-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
      </PlayerButton>
    </div>
  </div>
</template>

<script>
import db from '@/services/db';
import DriveMode from '@/components/DriveMode.vue';
import PlayerButton from '@/components/PlayerButton.vue';
import {
  play,
  pause,
  resume,
  stop,
} from '@/services/player';

export default {
  name: 'Player',
  components: {
    DriveMode,
    PlayerButton,
  },
  data() {
    return {
      audioData: null,
      isDriveMode: false,
      isPlaying: false,
    };
  },
  props: {
  },
  computed: {
    containerClass() {
      if (this.isDriveMode) {
        const classes = ['absolute', 'flex', 'flex-col', 'h-full', 'w-full', 'z-50', 'top-0'];
        return classes.reduce((acc, val) => {
          acc[val] = true;
          return acc;
        }, {});
      }

      return {};
    },
    track() {
      return this.$store.getters.currentTrack;
    },
  },
  watch: {
    track(track) {
      this.loadTrack(track);
    },
  },
  methods: {
    driveMode() {
      this.isDriveMode = !this.isDriveMode;
    },
    async loadTrack() {
      if (!this.track) {
        return;
      }

      try {
        play(this.track);

        this.isPlaying = true;
      } catch (e) {
        this.$store.dispatch('clearTrack');
        this.$emit('track-fail', this.track);
      }
    },
    togglePlay() {
      if (!this.track || !this.$store.getters.currentTrackLoaded) {
        return;
      }

      if (this.isPlaying) {
        this.isPlaying = false;
        pause();
      } else {
        this.isPlaying = true;
        resume();
      }
    },
    next() {
      this.$store.dispatch('loadNextTrackAsCurrent');
    },
    prev() {
      this.$store.dispatch('loadPrevTrackAsCurrent');
    },
    restart() {
      console.log('not implemented yet');
    },
  },
};
</script>
