var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
const {Wit, log} = require('node-wit');
// firebase client
var firebaseClient = require('./firebaseClient')

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
app.listen((process.env.PORT || 7000));

// Server index page
app.get("/", function (req, res) {
  res.send("Deployed!");
});


// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === process.env.WEBHOOK) {
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
  console.log("debug:", req.body);
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach(function(entry) {
      // Iterate over each messaging event
      entry.messaging.forEach(function(event) {
        console.log("debug:", event)
        if (event.postback) {
          processPostback(event);
        } else {
          messageHandle(event)
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
    console.log(`should do greeting to ${senderId}`);
    request({
      url: "https://graph.facebook.com/v2.6/" + senderId,
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
        fields: "first_name,picture.width(500).height(500)"
      },
      method: "GET"
    }, (error, response, body) => {
      var greeting = "";
      if (error) {
        console.log("Error getting user's name: " +  error);
      } else {
        var bodyObj = JSON.parse(body);
        name = bodyObj.first_name;
        picture = bodyObj.picture;
        greeting = "Hi " + name + ". ";
      }
      var message = greeting + "My name is Helpies Bot. We are matching volunteers and organizers";
      // create user in firebase:
      firebaseClient.createUsers({userId: senderId, name, picture: picture.data.url})
      sendMessage(senderId, {text: message}).then(_ => {
        // questions 0
        sendMessageZero(senderId)
      })
    });
    firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 0})
  }
}
const sendMessageZero = senderId => {
  return sendQuickReplyMessage({
    recipientId: senderId,
    text: "Are you a volunteer or an organizer ?",
    messages: ["volunteer", "organizer"],
  })
}

const sendMessageOne = ({senderId, role}) => {
  return sendMessage(senderId, {text: role === "organizer" ? "In which city you need help ?" : "In which city you want to help ?"})
}

const sendMessageTwo = ({senderId, role}) => {
  return sendMessage(senderId, {text: role === "organizer" ? "what do you need help with ?": "What are your skills ?"})
}

const sendMessageThree = ({senderId}) => {
  return sendMessage(senderId, {text: "Can you write a small description about yourself ? Or any achievement you are proud of ?"})
}

const sendMessageFour = ({senderId, role, skills, location}) => {
  return sendMessage(senderId, {text: role === "organizer" ?
    "Thank you we will match you with some volunteer that can help you. You can check it there: https://helpie-3c999.firebaseapp.com/meetup"
      + ` We also advice you to post on those hashtags${skills.map(s => "; https://www.instagram.com/explore/tags/" + s.split(" ").join("") + location.split(" ").join(""))}`
    : "Thank you for your help to the community. We don't have an opportunity that fits your skills at the moment. We will let you know if we find something. In the meantime, follow these hashtags:"
      + `${skills.map(s => " https://www.instagram.com/explore/tags/" + s.split(" ").join("") + location.split(" ").join(""))}`

  })
}

const messageHandle = (event) => {
  // get userBotNbQuestions
  // console.log("PAYLOAD LOG", event);
  const senderId = safe(() => event.sender.id)
  if (!senderId) {
    return
  }

  firebaseClient.getUserBotQuestionsNb({userId: senderId}).then(nb => {
    console.log(`handle bot question for user: ${senderId}`);
    if (nb === 0) {
      console.log("handler answer 1");
      const message = safe(() => event.message.quick_reply.payload)
      console.log(`message ${message}`);
      if (message === "volunteer" || message === "organizer") {
        firebaseClient.addRoleToUser({userId: senderId, role: message})
        sendMessageOne({senderId, role: message}).then(_ => {
          firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 1})
        })
      }
    } else if (nb === 1) {
      console.log("handler answer 2");
      const message = safe(() => event.message.text)
      console.log(`message ${message}`);
      getLocationFromUserMessage(message).then(location => {
        console.log(`user ${senderId} is from ${location}`);
        if (location) {
          firebaseClient.addLocationToUser({userId: senderId, location})
          firebaseClient.getUserRole({userId: senderId}).then(role => {
            sendMessageTwo({senderId, role})
            firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 2})
          })
        }
      })
    } else if (nb === 2) {
      console.log("handler answer 3");
      const message = safe(() => event.message.text, "")
      console.log(`message ${message}`);
      getKeyWordsFromUserMessage(message).then(keywords => {
        console.log(`user ${senderId} need/has`, keywords);
        if (keywords) {
          firebaseClient.getUserRole({userId: senderId}).then(role => {
            if (role === "organizer") {
              firebaseClient.addUserNeeds({userId: senderId, needs: keywords})
            } else {
              firebaseClient.addUserExperiences({userId: senderId, experiences: keywords})
            }
            sendMessageThree({senderId}).then(_ =>
              firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 3})
            )
          })
        } else if (message) {
          sendMessage(senderId, {text: `please try again with an other answer`})
        }
      })
    } else if (nb === 3) {
      console.log("handler answer 4");
      const message = safe(() => event.message.text, "")
      if (!message) {
        return
      }
      console.log(`message ${message}`);
      firebaseClient.addIntroduction({userId: senderId, introduction: message})
      firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 4})
      firebaseClient.getUserRole({userId: senderId}).then(role => {
        firebaseClient.getLocationUser({userId: senderId}).then(location =>
          firebaseClient.getSkills({userId: senderId, role}).then(skills => {
            sendMessageFour({senderId, role: role, skills, location}).then(_ => {
              if (role === "volunteer") {
                sendRecommendation(senderId)
              }
            })
          })
        )
      })
    }
  })
  // console.log(message);
  // firebaseClient.getUserBotQuestionsNb({userId: senderId}).then(nb => {
  //   if (nb === 0) {
  //     console.log("handler answer 1");
  //     firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 1})
  //   } else if (nb === 1) {
  //     console.log("handler answer 2");
  //     firebaseClient.setUserBotQuestionsNb({userId: senderId, nbQuestions: 2})
  //     return
  //   }
  // })
  // if case
}

// sends message to user
function sendMessage(recipientId, message) {
  return new Promise((resolve, reject) => {
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: "POST",
      json: {
        recipient: {id: recipientId},
        message: message,
      }
    }, (error, response, body) => {
      if (error) {
        console.log("Error sending message: " + response.error);
        reject()
      }
      resolve()
    });
  });
}

const sendQuickReplyMessage = ({recipientId, text = "", messages = [], questionNb = 0}) => {
  return new Promise((resolve, reject) => {
    console.log("will try to send quick reply Message");
    request({
      url: "https://graph.facebook.com/v2.6/me/messages",
      qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
      method: "POST",
      json: {
        recipient: {"id": recipientId},
        "message":{
          "text": text,
          "quick_replies": messages.map(t => ({
            "content_type": "text",
            "title": t,
            "payload": t,
            // "image_url":"http://example.com/img/red.png"
          })),
        }
      }
    }, (error, response, body) => {
      if (error) {
        console.log("Error sending message: " + response.error);
        reject()
      }
      resolve()
    });
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
// getLocationFromUserMessage("I am from seoul").then(location => console.log(location))


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
// getKeyWordsFromUserMessage("I need a webapp").then(keywords => console.log(keywords))

// example to create user
// firebaseClient.createUsers({userId: "idFromFacebookTest", name: "test"})
// firebaseClient.addLocationToUser({userId: "idFromFacebookTest", location: "seoul"})
// firebaseClient.addUserExperiences({userId: "idFromFacebookTest", experiences: ["webapp", "yolo"]})
// firebaseClient.addUserNeeds({userId: "idFromFacebookTest", needs: ["app"]})
// firebaseClient.getUserBotQuestionsNb({userId: 1634780963305366}).then(nb => console.log(nb))

const sendRecommendation = (userId) => {
  firebaseClient.getMatchingList({userId})
    .then(idMatch => {
      if (!idMatch || idMatch.length === 0) {
        return
      }
      sendMessage(userId, {text: `${idMatch[0]} is looking for someone with your skill!`})
      // try {
      //   request({
      //     url: "https://graph.facebook.com/v2.6/" + idMatch[0],
      //     qs: {
      //       access_token: process.env.PAGE_ACCESS_TOKEN,
      //       fields: "link"
      //     },
      //     method: "GET"
      //   }, (error, response, body) => {
      //     var bodyObj = JSON.parse(body) || {}
      //     console.log(body);
      //     const link = bodyObj.link || "fake facebook id: " + idMatch
      //     sendMessage("1634780963305366", {text: `${bodyObj.link} is looking for someone with your skill!`})
      //   })
      // } catch (e) {
      //   console.log(e)
      // }
    })
}

// sendRecommendation(1634780963305366)
