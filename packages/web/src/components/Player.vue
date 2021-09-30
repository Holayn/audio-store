<template>
  <div :class="containerClass">
    <div v-if="isDriveMode" class="flex flex-auto flex-col bg-white max-h-full">
      <DriveMode
        class="flex flex-auto"
        @togglePlay="togglePlay()"
        @previous="prev()"
        @next="next()"
        @restart="restart()"
        @exit="driveMode()"
        :track="track"
      />
      <span class="text-xs italic text-gray-400">swipe down to exit</span>
    </div>
    <div v-show="!isDriveMode" class="bg-gray-900">
      <div class="overflow-hidden h-6 bg-gray-700">
        <div ref="trackTitle" class="text-gray-400">{{trackTitle}}</div>
      </div>
      <div class="grid grid-cols-3 py-4">
        <div></div>
        <div class="flex justify-center">
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
        <div class="flex items-center justify-center">
          <Loading v-if="isHardwarePlayerLoading"/>
        </div>
        <!-- Hack to make mobile display document title and audio controls. -->
        <!-- This is in turn used by the car to display the document title as "currently playing" -->
        <audio ref="dummyPlayer" loop>
          <source src="@/assets/blank.mp3" type="audio/mp3">
        </audio>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/services/db';
import DriveMode from '@/components/DriveMode.vue';
import PlayerButton from '@/components/PlayerButton.vue';
import Loading from '@/components/Loading.vue';
import {
  play,
  pause,
  resume,
  stop,
} from '@/services/player';
import {
  getTrack,
} from '@/services/track';

export default {
  name: 'Player',
  components: {
    DriveMode,
    Loading,
    PlayerButton,
  },
  data() {
    return {
      audioData: null,
      isDriveMode: false,
      isPlaying: false,
      tippy: null,
      partNumberStart: null,
    };
  },
  async created() {
    const trackId = parseInt(localStorage.getItem('trackId'), 10);
    const playlistId = parseInt(localStorage.getItem('playlistId'), 10);
    const partNumber = parseInt(localStorage.getItem('partNumber'), 10);

    if (playlistId && trackId) {
      const track = await getTrack(trackId);
      await this.$store.dispatch('getPlaylistTracks', playlistId);
      this.$store.dispatch('loadCurrentTrack', track);
      this.partNumberStart = partNumber;
    }
  },
  updated() {
    /* eslint no-undef: ['off'] */
    this.tippy = tippy(this.$refs.trackTitle, {
      content: this.trackTitle,
      trigger: 'mouseenter click',
    });
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
    isHardwarePlayerLoading() {
      return this.$store.state.hardwarePlayerLoading;
    },
    trackTitle() {
      if (!this.track) return '';

      return this.track.title;
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
    async loadTrack(isFirstPlay) {
      if (!this.track || !this.$store.state.canPlay) {
        this.isPlaying = false;
        return;
      }

      try {
        this.isPlaying = true;
        if (isFirstPlay) {
          play(this.track, this.partNumberStart);
        } else {
          play(this.track);
        }
        this.$refs.dummyPlayer.play();
      } catch (e) {
        this.isPlaying = false;
        this.$store.dispatch('clearTrack');
        throw e;
      }
    },
    togglePlay() {
      if (!this.$store.state.canPlay) {
        // Player was initially loaded with a track, but we can now play it since
        // the user explicitly pressed play.
        this.$store.commit('canPlay', true);
        this.loadTrack(true);
        return;
      }

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
