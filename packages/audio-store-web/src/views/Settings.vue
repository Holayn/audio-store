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
  </div>
</template>

<script>
import db from '@/services/db';

export default {
  name: 'Settings',
  data() {
    return {
      size: null,
    };
  },
  async created() {
    this.size = await db.getSizeOfAudioStore() / 1000000;
  },
  methods: {
    closeSettings() {
      this.$router.push({ path: '/' });
    },
  },
};
</script>
