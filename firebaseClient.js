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
const userBotQuestions = firebase.database().ref("/botQuestions/")
const experiencesRef = firebase.database().ref("/experiences/")
const needsRef = firebase.database().ref("/needs/")

exports.createUsers = ({userId, email = "", name = "", location = "", role = "", picture = ""}) => {
  const newUser = userRef.child(userId)

  newUser.set({
    "name": name,
    "email": email,
    "location": location,
    "role": role,
    "picture": picture,
  });

  var newUserId = newUser.key;
  console.log("A new user item:" + newUserId + " is created.");
}

exports.setUserBotQuestionsNb = ({userId, nbQuestions}) => {
  const nbQuestionsDb = userBotQuestions.child(userId)

  nbQuestionsDb.set(nbQuestions)
  console.log(`user ${userId} answer question ${nbQuestions}`);
}

// return promise with the nb of questions already answer
exports.getUserBotQuestionsNb = ({userId}) => {
  const nbQuestionsDb = userBotQuestions.child(userId)
  return new Promise(resolve => {
    nbQuestionsDb.once("value", snapshot  => {
      resolve(snapshot.val())
    });
  });
}

exports.addRoleToUser = ({userId, role}) => {
  const updateUser = userRef.child(userId)

  updateUser.update({
    "role": role,
  });

  console.log(`role ${role} added to user ${userId}`);
}

exports.getUserRole = ({userId}) => {
  const updateUser = userRef.child(userId)
  return new Promise(resolve => {
    updateUser.once("value", snapshot  => {
      resolve(snapshot.val().role)
    });
  });
}

exports.addLocationToUser = ({userId, location = ""}) => {
  const updateUser = userRef.child(userId)

  updateUser.update({
    "location": location,
  });

  console.log(`location ${location} added to user ${userId}`);
}

exports.getLocationUser = ({userId}) => {
  const updateUser = userRef.child(userId)
  return new Promise(resolve => {
    updateUser.once("value", snapshot  => {
      resolve(snapshot.val().location)
    });
  });
}

exports.addUserExperiences = ({userId, experiences = []}) => {
  const newUserExperiences = experiencesRef.child(userId)

  newUserExperiences.set(experiences)

  console.log(`${experiences.length} experiences are added to user ${userId}`);
}

exports.addUserNeeds = ({userId, needs = []}) => {
  const newUserNeed = needsRef.child(userId)

  newUserNeed.set(needs)

  console.log(`${needs.length} needs are added to user ${userId}`);
}
