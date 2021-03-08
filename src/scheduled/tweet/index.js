let arc = require('@architect/functions')
const { TwitterClient } = require('twitter-api-client')
const axios = require('axios')

exports.handler = async function scheduled (event) {
  console.log(JSON.stringify(event, null, 2))

  const twitterClient = new TwitterClient({
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  })

  const status = await axios.get('http://history.muffinlabs.com/date')
    .then(response => {
      const data = response.data.data ? response.data.data : {}
      let tweet
      if (data.Events && data.Events.length) {
        //tweet the first event in the array
        tweet = 'Year ' + data.Events[0].year + ' - ' + data.Events[0].text
      } else {
        tweet = 'Nothing happened today :)'
      }
      return tweet
    }).catch(err => {
      console.error(err)
    })

    console.log(status)

    await twitterClient.tweets.statusesUpdate({
      status: status
    }).then(response => {
      console.log("Tweeted!", response)
    }).catch(err => {
      console.error(err)
    })

  return
}