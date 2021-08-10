<template>
  <div>
    <div class="flex flex-col justify-center items-center flex-auto my-4">
      <AddTrack/>
    </div>
  </div>
</template>

<script>
import AddTrack from '@/components/AddTrack.vue';

export default {
  name: 'Load',
  components: {
    AddTrack,
  },
  data() {
    return {
    };
  },
  computed: {
  },
  methods: {
    openSettings() {
      this.$router.push({ path: 'settings' });
    },
  },
};
</script>
