const axios = require('axios')
const fs = require('fs')
const formatDate = require('date-fns/format')

async function exportFromDatabase () {
  fs.mkdirSync(__dirname + '/content/blog/posts', { recursive: true })
  const { data } = await axios.get('https://admin.crackintheroad.com/wp-json/custom/routes/')
  Object.keys(data).forEach(async id => {
    try {
      const { data } = await axios.get(`https://admin.crackintheroad.com/wp-json/wp/v2/posts/${id}`)
      const formattedTitle = formatPostTitle(data)
      const formattedData = formatPostData(data)
      fs.writeFile(`${__dirname}/content/blog/posts/${formattedTitle}.json`, JSON.stringify(formattedData), err => {
        if(err) return console.log(err)
        console.log("The file was saved!")
      })
    } catch (err) {
      console.log(err)
    }
  })
}

exportFromDatabase()

function formatPostTitle (data) {
  const date = new Date(data.date)
  return formatDate(date, 'YYYY-MM-DD') + '-' + data.slug
}
function formatPostData (data) {
  return {
    title: data.title,
    date: data.date,
    thumbnail: data.post_thumbnail,
    category: data.category,
    body: data.content
  }
}