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
      :playlist="playlist"
      :title="playlist.title"/>
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
    };
  },
  async created() {
    this.$store.dispatch('getPlaylists');
  },
  computed: {
    playlists() {
      return this.$store.getters.playlists;
    },
  },
  methods: {
    viewPlaylist(playlist) {
      this.$router.push({ name: 'Tracks', params: { id: 1 } });
    },
  },
};
</script>
