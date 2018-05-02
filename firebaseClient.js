const firebase = require("firebase-admin");

// initializeFirebase
firebase.initializeApp({
  databaseURL: 'https://helpie-3c999.firebaseio.com/', // open DB
  credential: {
    getAccessToken: () => ({
      expires_in: 0,
      access_token: '',
    }),
  },
});

const userRef = firebase.database().ref("/users/")

exports.createUsers = ({userId, email = "", name = "", location = ""}) => {
  const newUser = userRef.child(userId)

  newUser.set({
    "name": name,
    "email": email,
    "location": location,
  });

  var newUserId = newUser.key;
  console.log("A new user item:" + newUserId + " is created.");
}

exports.addLocationToUser = ({userId, location = ""}) => {
  // Fetch the user's email.
  const newUser = userRef.child(userId)

  newUser.set({
    "location": location,
  });

  var newUserId = newUser.key;
  console.log(`location ${location} added to user ${userId}`);
}
