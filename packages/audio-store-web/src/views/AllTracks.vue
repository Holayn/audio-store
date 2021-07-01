<template>
  <div>
      <div class="text-2xl">All Tracks</div>
      <div class="flex items-start justify-center overflow-y-auto">
        <div class="justify-center max-w-full">
          <Track
            v-for="track in tracks"
            :key="track.id"
            :track="track"
            @remove="removeTrack(track)"/>
        </div>
      </div>
    </div>
</template>

<script>
import Track from '@/components/Track.vue';

export default {
  name: 'AllTracks',
  created() {
    this.$store.dispatch('getAllTracks');
  },
  data() {
    return {
    };
  },
  components: {
    Track,
  },
  props: {
  },
  computed: {
    tracks() {
      return this.$store.getters.tracks;
    },
  },
  methods: {
    removeTrack(track) {
      this.$store.dispatch('removeTrack', track);
    },
  },
};
</script>
