<template>
  <div class="flex p-2 m-1 bg-gray-100 rounded-md">
    <button
      type="button"
      @click="loadTrack()"
      class="w-16 h-1/2 mr-4 flex items-center justify-center rounded-md bg-black text-white">
      play
    </button>
    <div>
      {{this.track.title}}
    </div>
    <div class="pl-2">
      <span v-if="this.track.loaded">(loaded)</span>
    </div>
    <div v-if="this.track.loaded" class="pl-2">
      <button
        type="button"
        @click="unload()"
        class="w-16 rounded-md bg-black text-white">
        unload
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Track',
  props: ['track'],
  methods: {
    loadTrack() {
      this.$store.dispatch('loadCurrentTrack', this.track);
    },
    unload() {
      this.$store.dispatch('unloadTrack', this.track);
    },
  },
};
</script>
