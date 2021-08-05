<template>
  <div @swipedown="exit()" class="flex flex-col">
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
  </div>
</template>

<script>
import 'tocca';

export default {
  name: 'DriveMode',
  data() {
    return {
    };
  },
  props: ['track'],
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
      this.$emit('togglePlay');
    },
    previous() {
      this.$emit('previous');
    },
    next() {
      this.$emit('next');
    },
  },
};
</script>
