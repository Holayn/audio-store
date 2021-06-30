<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-end">
      <svg @click="closeSettings()" class="mt-4 mr-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
    </div>
    <div class="flex ml-8 mb-4 text-3xl">Settings</div>
    <div class="flex p-2 w-full">
      <div class="flex flex-col items-start w-full">
        <div class="text-gray-500">
          System Info
        </div>
        <div class="flex w-full text-sm">
          <div class="flex flex-auto">
            Audio stored on disk
          </div>
          <div>
            {{size}} MB
          </div>
        </div>
      </div>
    </div>
    <div class="flex p-2 w-full">
      <div class="flex flex-col items-start w-full">
        <div class="text-gray-500">
          Functions
        </div>
      </div>
    </div>
    <MenuButton @click="backupTracks()" title="Backup Tracks" class="pb-1"/>
    <Loading v-if="backupTracksLoading" class="ml-2"/>
    <MenuButton @click="backupPlaylists()" title="Backup Playlists" class="pb-1"/>
    <Loading v-if="backupPlaylistsLoading" class="ml-2"/>
    <MenuButton @click="reset()" title="Reset" class="text-red-500"/>
  </div>
</template>

<script>
import db from '@/services/db';
import { backupPlaylists as backPlays, backupTracks as backTracks } from '@/services/backup';

import MenuButton from '@/components/MenuButton.vue';
import Loading from '@/components/Loading.vue';

export default {
  name: 'Settings',
  components: {
    MenuButton,
    Loading,
  },
  data() {
    return {
      size: null,
      backupTracksLoading: false,
      backupPlaylistsLoading: false,
    };
  },
  async created() {
    this.size = await db.getSizeOfAudioStore() / 1000000;
  },
  methods: {
    closeSettings() {
      this.$router.push({ path: '/' });
    },
    async backupPlaylists() {
      if (!this.backupPlaylistsLoading) {
        this.backupPlaylistsLoading = true;
        await backPlays();
        this.backupPlaylistsLoading = false;
      }
    },
    async backupTracks() {
      if (!this.backupTracksLoading) {
        this.backupTracksLoading = true;
        await backTracks();
        this.backupTracksLoading = false;
      }
    },
    async reset() {
      await db.delete();
      window.location.reload();
    },
  },
};
</script>
