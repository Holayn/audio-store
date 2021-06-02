<template>
  <div class="flex">
    <div
      class="flex flex-auto h-10 items-center justify-center cursor-pointer"
      :class="{
        'border-t-2': this.currentRouteName === 'Load'
      }"
       @click="go('load')"
    >
      <div>
        Load
      </div>
    </div>
    <div
      class="flex flex-auto h-10 items-center justify-center cursor-pointer"
      :class="{
        'border-t-2': this.currentRouteName === 'Collection'
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
    currentRouteName() {
      console.log(this.$route.name);
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
