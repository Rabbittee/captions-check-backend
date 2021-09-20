const admin = require("firebase-admin");
const { usersRef } = require("../models");

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
  await usersRef.doc(user.email).set(UserData);
};
