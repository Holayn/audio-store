<template>
<div>
  <div class="flex p-2 m-1 bg-gray-100 rounded-md" :class="{'bg-green-50': this.track.loaded}">
    <button
      type="button"
      @click="loadTrack()"
      style="height: 3rem; width: 3rem; min-width: 3rem;"
      class="mr-4 flex items-center justify-center rounded-full bg-black text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    </button>
    <div class="max-h-12 overflow-auto">
      {{this.track.title}}
    </div>
    <div>
      <svg @click="toggleMenu()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
  </div>
  <div v-if="showMenu">
    <button
      v-if="this.track.loaded"
      type="button"
      @click="unload()"
      class="mx-1 w-16 rounded-md bg-black text-white">
      unload
    </button>
    <button
      type="button"
      @click="remove()"
      class="mx-1 w-16 rounded-md bg-black text-white">
      remove
    </button>
    <button
      type="button"
      @click="info()"
      class="mx-1 w-16 rounded-md bg-black text-white">
      info
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: 'Track',
  data() {
    return {
      showMenu: false,
    };
  },
  props: ['track'],
  methods: {
    loadTrack() {
      this.$store.dispatch('loadCurrentTrack', this.track);
    },
    unload() {
      this.toggleMenu();
      this.$store.dispatch('unloadTrack', this.track);
    },
    remove() {
      this.toggleMenu();
      this.$emit('remove', this.track);
    },
    info() {
      alert(`
        date added: ${this.track.dateAdded}
        size: ${(this.track.size ? this.track.size : 0) / 1000000} mb
        url: ${this.track.url}
      `);
      // this.$store.dispatch('removeTrack', this.track);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
