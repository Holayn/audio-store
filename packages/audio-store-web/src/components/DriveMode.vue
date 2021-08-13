<template>
  <div @swipedown="exit()" class="flex flex-col overflow-hidden static">
    <div class="grid grid-row-3 flex-auto">
      <div @click="togglePlay()" class="flex items-center justify-center bg-gray-400">
        play/pause
      </div>
      <div @click="next()" class="flex items-center justify-center bg-red-400">
        next
      </div>
      <div @click="prev()" class="flex items-center justify-center">
        prev
      </div>
    </div>
    <div v-if="!isActive" class="flex flex-col flex-auto items-center justify-center h-full w-full bg-black absolute pointer-events-none">
      <div v-if="track" class="text-white text-6xl">{{track.title}}</div>
      <div v-if="playlist" class="text-white text-3xl">{{playlist.title}}</div>
    </div>
  </div>
</template>

<script>
import 'tocca';

export default {
  name: 'DriveMode',
  data() {
    return {
      isActive: true,
    };
  },
  props: ['track'],
  mounted() {
    setTimeout(() => {
      this.isActive = false;
    }, 3000);
  },
  computed: {
    playlist() {
      return this.$store.getters.currentPlaylist;
    },
  },
  methods: {
    exit() {
      this.$emit('exit');
    },
    togglePlay() {
      this.makeActive();
      this.$emit('togglePlay');
    },
    previous() {
      this.makeActive();
      this.$emit('previous');
    },
    next() {
      this.makeActive();
      this.$emit('next');
    },
    makeActive() {
      this.isActive = true;
      setTimeout(() => {
        this.isActive = false;
      }, 3000);
    },
  },
};
</script>
