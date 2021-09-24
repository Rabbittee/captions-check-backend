const User = require("./User");
const admin = require("firebase-admin");
const db = admin.firestore();

const getGroupRef = () => db.collection("groups");

const getUser = async (group) => {
  group.manager = await User.getUserData(group.manager);
  group.members = await Promise.all(
    group.members.map(async (member) => {
      return await User.getUserData(member);
    })
  );
  return group;
};

const getList = async (name) => {
  if (name != null) {
    return await getGroupRef()
      .orderBy("name")
      .startAt(name)
      .endAt(name + "\uf8ff")
      .get();
  }
  return await getGroupRef().orderBy("name").get();
};

module.exports = {
  getGroupRef,
  getUser,
  getList,
};
