const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const UsersRef = db.collection("users");

exports.createUser = async (user) => {
  const UserData = user.toJSON();
  const mergeData = {
    providerId: UserData.providerData[0].providerId,
    creationTime: admin.firestore.Timestamp.fromDate(
      new Date(Number(UserData.metadata.creationTime))
    ),
    lastSignInTime: admin.firestore.Timestamp.fromDate(
      new Date(Number(UserData.metadata.lastSignInTime))
    ),
    isActive: true,
    groups: [],
  };
  Object.assign(UserData, mergeData);
  delete UserData.providerData;
  delete UserData.metadata;
  await UsersRef.doc(user.email).set(UserData);
};
