<template>
  <div>
    <div class="flex p-2 bg-gray-50 cursor-pointer">
      <div class="flex flex-auto ml-4 justify-start">
        {{title}}
      </div>
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuItem',
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
