<template>
  <div>
    <div
      @dbltap="togglePlay()"
      @swipedown="restart()"
      @swipeleft="previous()"
      @swiperight="next()"
      class="flex flex-col w-full">
        <div class="flex flex-col flex-auto justify-end">
          <div>
            <div class="text-gray-400">Track</div>
            <div>Poop</div>
          </div>
          <div>
            <div class="text-gray-400">Playlist</div>
            <div>Poop</div>
          </div>
        </div>
        <div class="flex flex-col flex-auto justify-center">
          <div>Double tap to pause/play</div>
          <div>Swipe right for next</div>
          <div>Swipe down for restart</div>
          <div>Swipe left for previous</div>
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
  props: {
  },
  computed: {
  },
  methods: {
    togglePlay() {
      this.$emit('togglePlay');
    },
    previous() {
      this.$emit('previous');
    },
    next() {
      this.$emit('next');
    },
    restart() {
      this.$emit('restart');
    },
  },
};
</script>
