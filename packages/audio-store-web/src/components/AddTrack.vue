<template>
  <div class="flex justify-center items-center">
    <input type="text" v-model="urlToLoad" class="border text-gray-900" placeholder="yt url">
    <button
      type="button"
      @click="loadTrack()"
      class="w-16 h-1/2 mr-4 flex items-center justify-center rounded-md bg-black text-white">
      load
    </button>
  </div>
</template>

<script>
// import db from '@/services/db';

export default {
  name: 'AddTrack',
  data() {
    return {
      urlToLoad: '',
    };
  },
  props: {
  },
  computed: {
  },
  methods: {
    async loadTrack() {
      this.$store.dispatch('addNewTrack', this.urlToLoad);
    },
  },
};
</script>
