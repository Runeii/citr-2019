import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import qs from 'qs'
Vue.use(Vuex)

const createStore = () =>
  new Vuex.Store({
    state: {
      posts: [],
      spotifyToken: false,
      spotifyPlaylists: []
    },
    mutations: {
      'SET_POSTS' (state, data) {
        state.posts = data
      },
      'SET_SPOTIFY_TOKEN' (state, data) {
        state.spotifyToken = data
      },
      'ADD_SPOTIFY_PLAYLIST_DETAILS' (state, data) {
        state.spotifyPlaylists.push(data)
      }
    },
    actions: {
      async nuxtServerInit ({ dispatch }) {
        await dispatch('getPosts')
      },
      async getPosts ({ state, commit }) {
        const context = await require.context('~/content/blog/posts/', false, /\.json$/);
        const searchposts = await context.keys().map(key => ({
          ...context(key),
          _path: `/blog/${key.replace('.json', '').replace('./', '')}`
        }));
        commit('SET_POSTS', searchposts.reverse())
      },
      async spotifyAPIWrapper ({dispatch, state}, endpoint) {
        if (!state.spotifyToken) await dispatch('getSpotifyToken')
        console.log('Have token', state.spotifyToken)
        const response = await axios({
          method: 'get',
          url: 'https://api.spotify.com/v1' + endpoint,
          headers: {'Authorization': `Bear ${state.spotifyToken}`}
        })
        return response
      },
      async getSpotifyToken ({commit}) {
        try {
          const response = await axios.post('https://accounts.spotify.com/api/token', qs.stringify({'grant_type': 'client_credentials'}), {
            headers: {
              'Authorization': `Basic ${process.env.VUE_APP_SPOTIFY_BASE}`,
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          commit('SET_SPOTIFY_TOKEN', response.data.access_token)
        } catch (err) {
          console.log(`SPOTIFY ERROR: ${err.response.status} thrown while getting token`, err.response.statusText)
        }
      },
      async getSpotifyPlaylists ({commit, dispatch}) {
        const sources = await require('~/content/playlists.json')
        Object.keys(sources).forEach(async key => {
          console.log('Fired', key)
          let playlist = await dispatch('spotifyAPIWrapper', `/playlists/${sources[key]}/tracks`)
          console.log(playlist)
          commit('ADD_SPOTIFY_PLAYLIST_DETAILS', playlist.data)
        })
      }
    }
  })

export default createStore
