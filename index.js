var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
const {Wit, log} = require('node-wit');

const client = new Wit({
  accessToken: process.env.WIT_TOKEN,
  logger: new log.Logger(log.DEBUG) // optional
});

const safe = (f, def) => {
  let res = def
  try { res = f() } catch (e) { /* ignore */ }
  return res
}

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "this_is_my_token") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        if (event.postback) {
          processPostback(event);
        }
      });
    });

    res.sendStatus(200);
  }
});

function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  if (payload === "Greeting") {
    // Get user's first name from the User Profile API
    // and include it in the greeting
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name"
      },
      method: "GET"
    }, function(error, response, body) {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is Helpies Bot. We are matching volonteers and organizers";
      sendMessage(senderId, {text: message});
    });
  }
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });
}

// helper function to get user location from message
const getLocationFromUserMessage = message => {
  return new Promise(function(resolve, reject) {
    client.message(message, {})
    .then((data) => {
      // TODO: Get the best confidence instead of first value
      const location = safe(_ => data.entities.location[0].value, "")
      console.log(`message: ${message} location: ${location}`);
      resolve(location)
    })
    .catch(console.error);
  });
}
// example of how to use getLocationFromUserMessage
getLocationFromUserMessage("I am from seoul").then(location => console.log(location))


// helper function to get user keyword
// return array of keyword
const getKeyWordsFromUserMessage = message => {
  return new Promise(function(resolve, reject) {
    client.message(message, {})
    .then((data) => {
      // TODO: Get the best confidence instead of first value
      const keywords = safe(_ => data.entities.needs.map(({value}) => value), "")
      resolve(keywords)
    })
    .catch(console.error);
  });
}
// example of how to use getLocationFromUserMessage
getKeyWordsFromUserMessage("I need a webapp").then(keywords => console.log(keywords))
