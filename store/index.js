import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const createStore = () =>
  new Vuex.Store({
    state: {
      posts: []
    },
    mutations: {
      'SET_POSTS' (state, data) {
        state.posts = data
      }
    },
    actions: {
      async nuxtServerInit({ dispatch }) {
        await dispatch('getPosts')
      },
      async getPosts({ state, commit }) {
        const context = await require.context('~/content/blog/posts/', false, /\.json$/);
        const searchposts = await context.keys().map(key => ({
          ...context(key),
          _path: `/blog/${key.replace('.json', '').replace('./', '')}`
        }));
        commit('SET_POSTS', searchposts.reverse())
      }
    }
  })

export default createStore
