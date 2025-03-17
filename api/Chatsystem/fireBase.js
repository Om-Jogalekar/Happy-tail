var admin = require("firebase-admin");

var serviceAccount = require("./happy-tail-1e919-firebase-adminsdk-fbsvc-f0a40e39f7.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://happy-tail-1e919-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;