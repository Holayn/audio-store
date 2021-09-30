<template>
  <div>
    <div class="flex p-2 bg-gray-50 cursor-pointer">
      <div class="flex flex-auto ml-4 justify-start">
        {{title}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuButton',
  props: ['title'],
  components: {
  },
  data() {
    return {
    };
  },
  created() {
  },
  computed: {
  },
  methods: {
  },
};
</script>
