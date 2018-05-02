const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  app_secret: 'EAAd73TLwaw0BANVAZB3difZC3QN6uMVhLlCt338MZClnWNs4mPtni4FLzPZCJhl8NuSw81yOTtJZCehZCfqhFCQEVBZCZC1ZCoYa1qVUz4dw9Xws1ZB39BIlQYY8dAxwtfycjw337utLV9Ic3IBG1B78sGJwaOaGEdHFYeHovVNtmtcgZDZD',
  verify: 'helpies',
  token: '2106514809580301'
})

bot.on('error', (err) => {
  console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

http.createServer(bot.middleware()).listen(3000)
console.log('Echo bot server running at port 3000')
