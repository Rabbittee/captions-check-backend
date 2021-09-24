const admin = require("firebase-admin");
const db = admin.firestore();

const usersRef = db.collection("users");

const getUserRef = (email) => usersRef.doc(email);

const getUserData = async (userRef, fields = ["displayName"]) => {
  const user = await userRef.get();
  return fields.reduce((obj, key) => {
    obj[key] = user.get(key);
    return obj;
  }, {});
};

const joinGroup = async (userRef, groupRef) => {
  await userRef.update({
    groups: admin.firestore.FieldValue.arrayUnion(groupRef),
  });
};

module.exports = {
  getUserRef,
  getUserData,
  joinGroup,
};
