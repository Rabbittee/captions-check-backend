const admin = require("firebase-admin");
const { User } = require("../models");

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
    admin: false,
    groups: [],
  };
  Object.assign(UserData, mergeData);
  delete UserData.providerData;
  delete UserData.metadata;
  await User.getUserRef(user.email).set(UserData);
};
