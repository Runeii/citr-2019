const axios = require('axios')
const fs = require('fs')
const formatDate = require('date-fns/format')

const TurndownService = require('turndown')
const turndownService = new TurndownService()

async function exportFromDatabase () {
  function progressIndicator () {
    return Math.round((completed / totalPosts) * 100) + '%'
  }

  fs.mkdirSync(__dirname + '/content/blog/posts', { recursive: true })
  const { data } = await axios.get('https://admin.crackintheroad.com/wp-json/custom/routes/')

  const totalPosts = Object.keys(data).length
  let completed = 0
  await asyncForEach(Object.keys(data), async id => {
    try {
      const { data } = await axios.get(`https://admin.crackintheroad.com/wp-json/wp/v2/posts/${id}`)
      const formattedTitle = formatPostTitle(data)
      const formattedData = formatPostData(data)
      fs.writeFile(`${__dirname}/content/blog/posts/${formattedTitle}.json`, JSON.stringify(formattedData, null, 2), err => {
        if(err) return console.log(`Post ${id} write error:`, err)
        completed++
        console.log(`Post ${id} converted successfully. (${progressIndicator()})`)
      })
    } catch (err) {
      console.log(`Post ${id}, error: ${err.response.status}. ${err.response.statusText}`)
    }
  })
  console.log('Process completed')
}

exportFromDatabase()

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function formatPostTitle (data) {
  const date = new Date(data.date)
  return formatDate(date, 'YYYY-MM-DD') + '-' + data.slug
}


function formatPostData (data) {
  return {
    id: data.id,
    title: sanitiseWordPressCopy(data.title.rendered),
    date: data.date,
    body: turndownService.turndown(data.content.rendered),
    image: {
      url: data.featured_image_url,
      srcset: data.featured_image_srcset
    },
    excerpt: {
      full: turndownService.turndown(data.excerpt.rendered),
      short: data.custom_excerpt
    },
    author: data.author,
    categories: data.categories,
    tags: data.tags,
    featured: data.sticky
  }
}

function sanitiseWordPressCopy (copy) {
  return copy.replace(/&#8211;/g, '–').replace(/&#8217;/g, `'`).replace(/&#038;/g, `&`)
}