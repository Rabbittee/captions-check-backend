const User = require("./User");
const admin = require("firebase-admin");
const db = admin.firestore();

const groupsRef = db.collection("groups");

const queryGroup = async (name) => {
  return await groupsRef.where("name", "==", name).get();
};

const getGroupRef = (groupId) => {
  if (groupId != null) {
    return groupsRef.doc(groupId);
  } else {
    return groupsRef.doc();
  }
};

const getGroupData = async (groupRef) => {
  return await groupRef.get();
};

const setGroup = async (groupRef, data) => {
  await groupRef.set(data);
};

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
  queryGroup,
  getGroupRef,
  getGroupData,
  setGroup,
  getUser,
  getList,
};
