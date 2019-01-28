<template>
  <article class="playlist">
    <h2 class="playlist__title">{{data.title}}</h2>
    <p class="palylist">{{data.excerpt.short}}</p>
    <img class="featured__image" :src="data.image.url" />
  </article>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'Featured',
  props: ['data'],
  computed: {
    category () {
      return this.$props.data.categories[0]
    }
  }
}
</script>

<style lang="scss">
.featured {
  width: 100%;
}
</style>
