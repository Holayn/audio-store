<template>
  <div>
    <MenuItem title="All Tracks"/>
    <div class="flex ml-4 pt-4 text-3xl">
      Playlists
    </div>
    <MenuItem
      v-for="playlist in playlists"
      @click="viewPlaylist(playlist)"
      :key="playlist.id"
      :title="playlist.title"/>
    <div class="flex p-2">
      <div class="flex flex-auto ml-4 justify-start">
        <svg @click="viewCreatePlaylist()" class="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </div>
    </div>
    <div v-if="showCreatePlaylist">
      <input v-model="newPlaylistName" class="mr-2 border text-gray-900" placeholder="name">
      <button
        @click="addNewPlaylist()"
        class="w-16 h-1/2 rounded-md bg-black text-white">
        add
      </button>
    </div>
  </div>
</template>

<script>
import MenuItem from '@/components/MenuItem.vue';

export default {
  name: 'Collection',
  components: {
    MenuItem,
  },
  data() {
    return {
      showCreatePlaylist: false,
      newPlaylistName: null,
    };
  },
  computed: {
    playlists() {
      return Object.keys(this.$store.getters.playlists)
        .map((playlistId) => this.$store.getters.playlists[playlistId]);
    },
  },
  methods: {
    viewPlaylist(playlist) {
      this.$router.push({ name: 'Tracks', params: { id: playlist.id } });
    },
    viewCreatePlaylist() {
      this.showCreatePlaylist = !this.showCreatePlaylist;
    },
    addNewPlaylist() {
      this.$store.dispatch('addNewPlaylist', this.newPlaylistName);
      this.newPlaylistName = null;
      this.showCreatePlaylist = false;
    },
  },
};
</script>
