<template>
  <article class="featured">
    <p class="featured__category">{{category}}</p>
    <h3 class="featured__title">{{data.title}}</h3>
    <p class="featured__excerpt">{{data.excerpt.short}}</p>
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
