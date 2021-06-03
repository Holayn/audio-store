<template>
  <div class="flex">
    <div
      class="flex flex-auto h-10 items-center justify-center cursor-pointer"
      :class="{
        'border-t-2': this.currentRouteName === 'Load'
      }"
       @click="go('/load')"
    >
      <div>
        Load
      </div>
    </div>
    <div
      class="flex flex-auto h-10 items-center justify-center cursor-pointer"
      :class="{
        'border-t-2': this.currentRoutePath.match(/.*collection.*/)
      }"
      @click="go('/')"
    >
      <div>
        Collection
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNavigator',
  data() {
  },
  props: [],
  computed: {
    currentRoutePath() {
      return this.$route.path;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
  methods: {
    go(path) {
      this.$router.push({ path });
    },
  },
};
</script>
