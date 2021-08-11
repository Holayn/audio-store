<template>
<div>
  <div class="flex relative p-2 m-1 bg-gray-100 rounded-md overflow-hidden" :class="{'bg-green-50': this.track.loaded}">
    <button
      type="button"
      @click="loadTrack()"
      style="height: 3rem; width: 3rem; min-width: 3rem;"
      class="mr-4 flex items-center justify-center rounded-full bg-black text-white focus:outline-none"
      :class="{
        'bg-yellow-500': isPlaying,
      }"
    >
      <svg v-if="!this.track.loaded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
    </button>
    <div class="flex-auto mr-1 max-h-12 overflow-auto">
      {{this.track.title}}
    </div>
    <div>
      <svg @click="toggleMenu()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
    </div>
    <div v-if="loading" class="flex absolute w-full h-3/4 items-center justify-center">
      <Loading/>
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
import db from '@/services/db';
import { play, free, stop } from '@/services/player';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Track',
  components: {
    Loading,
  },
  data() {
    return {
      showMenu: false,
      audioArrayBuffer: null,
      loading: false,
    };
  },
  props: ['track'],
  methods: {
    async loadTrack() {
      this.loading = true;

      if (this.track.loaded) {
        stop();
        free();
        await this.$store.dispatch('loadCurrentTrack', this.track);
        this.$store.commit('canPlay', true);
      } else {
        await this.$store.dispatch('loadTrack', this.track);
      }

      this.loading = false;
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
        date added: ${new Date(this.track.dateAdded)}
        size: ${(this.track.size ? this.track.size : 0) / 1000000} mb
        url: ${this.track.url}
      `);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
  computed: {
    isPlaying() {
      if (this.track && this.$store.getters.currentTrack) {
        return this.track.id === this.$store.getters.currentTrack.id;
      }
      return false;
    },
  },
};
</script>
