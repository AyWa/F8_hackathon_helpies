const firebase = require("firebase-admin");
// initializeFirebase
firebase.initializeApp({
  databaseURL: process.env.DB, // open DB
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

const createUsers = ({userId, email = "", name = "", location = "", role = "", picture = ""}) => {
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
exports.createUsers = createUsers;

const setUserBotQuestionsNb = ({userId, nbQuestions}) => {
  const nbQuestionsDb = userBotQuestions.child(userId)

  nbQuestionsDb.set(nbQuestions)
  console.log(`user ${userId} answer question ${nbQuestions}`);
}
exports.setUserBotQuestionsNb = setUserBotQuestionsNb

// return promise with the nb of questions already answer
const getUserBotQuestionsNb = ({userId}) => {
  const nbQuestionsDb = userBotQuestions.child(userId)
  return new Promise(resolve => {
    nbQuestionsDb.once("value", snapshot  => {
      resolve(snapshot.val())
    });
  });
}
exports.getUserBotQuestionsNb = getUserBotQuestionsNb

const addRoleToUser = ({userId, role}) => {
  const updateUser = userRef.child(userId)

  updateUser.update({
    "role": role,
  });

  console.log(`role ${role} added to user ${userId}`);
}
exports.addRoleToUser = addRoleToUser

const getUserRole = ({userId}) => {
  const updateUser = userRef.child(userId)
  return new Promise(resolve => {
    updateUser.once("value", snapshot  => {
      resolve(snapshot.val().role)
    });
  });
}
exports.getUserRole = getUserRole

const addLocationToUser = ({userId, location = ""}) => {
  const updateUser = userRef.child(userId)

  updateUser.update({
    "location": location,
  });

  console.log(`location ${location} added to user ${userId}`);
}
exports.addLocationToUser = addLocationToUser


const addIntroduction = ({userId, introduction}) => {
  const updateUser = userRef.child(userId)

  updateUser.update({
    introduction,
  });

  console.log(`introduction ${introduction} added to user ${userId}`);
}
exports.addIntroduction = addIntroduction


const getLocationUser = ({userId}) => {
  const updateUser = userRef.child(userId)
  return new Promise(resolve => {
    updateUser.once("value", snapshot  => {
      resolve(snapshot.val().location)
    });
  });
}
exports.getLocationUser = getLocationUser

const addUserExperiences = ({userId, experiences = []}) => {
  const newUserExperiences = experiencesRef.child(userId)

  newUserExperiences.set(experiences)

  console.log(`${experiences.length} experiences are added to user ${userId}`);
}
exports.addUserExperiences = addUserExperiences


const getSkills = ({userId, role, withId = false}) => {
  if (role === "organizer") {
    const newUserNeed = needsRef.child(userId)
    return new Promise(resolve => {
      newUserNeed.once("value", snapshot  => {
        if (withId) {
          resolve({id: userId, val: snapshot.val()})
        } else {
          resolve(snapshot.val())
        }
      });
    });
  } else {
    const newUserExperiences = experiencesRef.child(userId)
    return new Promise(resolve => {
      newUserExperiences.once("value", snapshot  => {
        if (withId) {
          resolve({id: userId, val: snapshot.val()})
        } else {
          resolve(snapshot.val())
        }
      });
    });
  }
}
exports.getSkills = getSkills

const addUserNeeds = ({userId, needs = []}) => {
  const newUserNeed = needsRef.child(userId)

  newUserNeed.set(needs)

  console.log(`${needs.length} needs are added to user ${userId}`);
}
exports.addUserNeeds = addUserNeeds

exports.getMatchingList = ({userId}) => {
  return new Promise(function(resolve, reject) {
    getLocationUser({userId}).then(location => {
      getUserRole({userId}).then(role => {
        getSkills({userId, role}).then(skills => {
          userRef.once("value", snap  => {
             const users = snap.val()
             const usersIdWithRightLocation = []
             Object.entries(users).forEach(([key, value]) => {
               if (value.location === location && value.role === "organizer") {
                 usersIdWithRightLocation.push(key)
               }
             });
             // then check there skill needed
             Promise.all(
               usersIdWithRightLocation.map(id => getSkills({userId: id, role: "organizer", withId: true}))
             ).then(a => {
               const allId = a.filter(b => {
                 if (b.val.filter(c => skills.includes(c)).length > 0) {
                   return true
                 }
                 return false
               }).map(z => z.id)
               resolve(allId)
             })
          })
        })
      })
    })
  });
}
