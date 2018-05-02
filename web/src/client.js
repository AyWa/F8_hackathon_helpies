import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAixrgTepTRCcJaxhl1njj2ek9-1eeVtl4",
  authDomain: "helpie-3c999.firebaseapp.com",
  databaseURL: "https://helpie-3c999.firebaseio.com",
  projectId: "helpie-3c999",
  storageBucket: "helpie-3c999.appspot.com",
  messagingSenderId: "901548823685"
};
firebase.initializeApp(config);

export const ref = firebase.database().ref()
export const auth = firebase.auth
export const provider = new firebase.auth.FacebookAuthProvider();