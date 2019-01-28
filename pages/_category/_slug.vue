<template>
</template>
<script>
export default {
  name: 'SinglePost',
  async asyncData({ params, app, payload, route, store }) {
    let post = await import(`~/content/page/posts/${params.slug}.json`)
    console.log(post);
    return post
  },
}
</script>
<style lang='scss'>
</style>