<template>
  <div class="flex flex-col h-full mt-4">
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
    <MenuButton @click="resetAudioContext()" title="Reset Audio Player" class="text-blue-300"/>
    <MenuButton @click="reload()" title="Reload" class="text-blue-500"/>
    <MenuButton @click="reset()" title="Reset" class="text-red-500"/>
  </div>
</template>

<script>
import db from '@/services/db';
import { backupPlaylists as backPlays, backupTracks as backTracks } from '@/services/backup';
import { resetAudioContext } from '@/services/player';

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
      localStorage.clear();
      await db.delete();
    },
    reload() {
      window.location.reload();
    },
    resetAudioContext() {
      resetAudioContext();
    },
  },
};
</script>
