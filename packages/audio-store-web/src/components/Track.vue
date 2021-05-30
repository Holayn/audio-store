<template>
  <div class="flex p-2 m-1 bg-gray-100 rounded-md" :class="{'bg-green-50': this.track.loaded}">
    <button
      type="button"
      @click="loadTrack()"
      style="height: 3rem; width: 3rem; min-width: 3rem;"
      class="mr-4 flex items-center justify-center rounded-full bg-black text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    </button>
    <div>
      {{this.track.title}}
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
