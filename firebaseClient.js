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
const experiencesRef = firebase.database().ref("/experiences/")
const needsRef = firebase.database().ref("/needs/")

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
  const updateUser = userRef.child(userId)

  updateUser.update({
    "location": location,
  });

  console.log(`location ${location} added to user ${userId}`);
}

exports.addUserExperiences = ({userId, experiences = []}) => {
  const newUserExperiences = experiencesRef.child(userId)

  newUserExperiences.set(experiences)

  console.log(`${experiences.length} experiences are added to user ${userId}`);
}

exports.needs = ({userId, needs = []}) => {
  const newUserNeed = needsRef.child(userId)

  newUserNeed.set(needs)

  console.log(`${needs.length} needs are added to user ${userId}`);
}
