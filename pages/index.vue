<template>
  <main class="index">
    <Featured :data="posts[0]" />
    <Featured :data="posts[1]" />
    <Playlist :data="playlists.newMusic" />
    <Featured :data="posts[2]" />
  </main>
</template>

<script>
import {mapState} from 'vuex'
import Featured from '@/components/Featured.vue'
export default {
  name: 'Index',
  components: {
    Featured
  },
  data () {
    return {
      playlists: {
        newMusic: {

        }
      }
    }
  },
  computed: {
    ...mapState(['posts'])
  }
}
</script>

<style lang="scss">
.index {
  
}
</style>
