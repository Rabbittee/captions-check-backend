const admin = require("firebase-admin");
const db = admin.firestore();

const groupsRef = db.collection("groups");
const usersRef = db.collection("users");

exports.groupsRef = groupsRef;
exports.usersRef = usersRef;
