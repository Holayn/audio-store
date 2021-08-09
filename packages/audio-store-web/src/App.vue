<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-end">
      <svg @click="goBack()" class="mt-4 ml-4 mb-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      <span class="flex flex-auto justify-center items-center">
        <div @click="driveMode()" class="cursor-pointer">
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA20lEQVRIie2UTQqCYBCGnyKpVXSBIAi6Tm2K6DYFdQAvUfeopcvoGtIP1spaNIJ96ec3aNDCF4YRfH9mBhRq/CtWQAQ8HSsClq7mfSBWmCcVAwPTrJkRMAcawFa6S+2kT102CGSisQtZMBFNUEQcCvEMdBQBbSAU7Sj9wjzRQnoXuON+/wfQE+3MNslRYZpXJ1tAQvJspBx4KX1hAMAGuAFrC9/kqAKu8nyx8E3OV0DWd5DAl+n8kpwPFK6o1bcsxEpgO1ElyNsA3v8WDTK3Njc4SN8rzctqa/wQL3OaZuJL7ZcIAAAAAElFTkSuQmCC"/>
        </div>
      </span>
      <svg @click="openSettings()" class="mt-4 mr-4 mb-4 cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    </div>
    <router-view class="flex flex-auto overflow-hidden"/>
    <div>
      <TabNavigator/>
    </div>
    <div>
      <Player ref="player" @trackFail="trackFailed($event)"/>
    </div>
  </div>
</template>

<script>
import Player from '@/components/Player.vue';
import TabNavigator from '@/components/TabNavigator.vue';

export default {
  name: 'App',
  components: {
    Player,
    TabNavigator,
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    driveMode() {
      this.$refs.player.driveMode();
    },
    goBack() {
      window.history.back();
    },
    openSettings() {
      this.$router.push({ name: 'Settings' });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
