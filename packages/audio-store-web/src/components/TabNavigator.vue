<template>
  <div class="flex">
    <div
      class="flex flex-auto h-10 items-center justify-center cursor-pointer"
      :class="{
        'border-t-2': this.currentRouteName === 'Load'
      }"
       @click="go('Load')"
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
      @click="go('Collection')"
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
    return {};
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
    go(name) {
      this.$router.push({ name });
    },
  },
};
</script>
