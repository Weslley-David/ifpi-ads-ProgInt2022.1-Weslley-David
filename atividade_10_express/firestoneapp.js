
var admin = require("firebase-admin");

var serviceAccount = require("./keys.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

db = admin.firestore();

/*db.collection('posts').add({
  text : "são 10 da noite",
  //date: Timestamp { _seconds: 1654107540, _nanoseconds: 0 },
  likes : 5
})
console.log('connected'); */

db.collection("posts")
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, "=>", doc.data());
      console.log({id : doc.id, ...doc.data()});
    });
  })
  .catch((error) => {
    console.log('Error getting documents', error);
  });