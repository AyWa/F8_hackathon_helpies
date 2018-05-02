const http = require('http')
const Bot = require('messenger-bot')

let bot = new Bot({
  app_secret: 'EAAd73TLwaw0BAAxaeXLoZAqHzcMJYZCei1y1nqLDh7m4dLb9w3mmZCTUmrZAQtJdsQuXiZCKi7aSbRbZB6YKP7RVkgvYycCscnEBM0xgZBJVVxhXZB2L5hJJSUMSYp0eZB02ulW42prDCMcgSF6aaqFA6hJJAozBZADIKPKoyuj0BtbAZDZD',
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
