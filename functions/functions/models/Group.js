const admin = require("firebase-admin");
const User = require("./User");
const db = admin.firestore();

const groupsRef = db.collection("groups");

const queryGroup = async (name) => {
  return await groupsRef.where("name", "==", name).get();
};

const getGroupRef = (groupId) => {
  if (groupId != null) {
    return groupsRef.doc(groupId);
  }
  return groupsRef.doc();
};

const getGroupData = async (groupRef, options = {}) => {
  const defaultOptions = {
    addRef: true,
    raw: false,
  };
  options = Object.assign(defaultOptions, options);
  const group = await groupRef.get();

  if (!group.exists) {
    return undefined;
  }

  let data = group.data();
  if (options.addRef) {
    data.groupRef = groupRef;
  }

  if (options.raw) {
    return data;
  }

  return await format(data);
};

const setGroup = async (groupRef, data) => {
  return await groupRef.set(data);
};

const format = async (group) => {
  group.manager = await User.getUserData(group.manager);
  group.members = await Promise.all(
    group.members.map(async (member) => {
      return await User.getUserData(member);
    })
  );
  delete group.createDate;
  return group;
};

const getList = async (name) => {
  let snapshot = null;
  if (name != null) {
    snapshot = await groupsRef
      .orderBy("name")
      .startAt(name)
      .endAt(name + "\uf8ff")
      .get();
  } else {
    snapshot = await groupsRef.orderBy("name").get();
  }

  if (snapshot.empty) {
    return [];
  }

  return await Promise.all(
    snapshot.docs.map(async (doc) => await format(doc.data()))
  );
};

const checkUser = (group, user) => {
  const userRefPath = user.userRef.path;
  const match = group.members.find(
    (memberRef) => memberRef.path === userRefPath
  );
  return match !== undefined;
};

const registerUser = async (group, user) => {
  if (checkUser(group, user)) {
    throw {
      type: "DUPLICATED_VALUE",
      msg: `member ${user.name} exist`,
    };
  }

  await group.groupRef.update({
    members: admin.firestore.FieldValue.arrayUnion(user.userRef),
  });

  await User.joinGroup(user.userRef, group.groupRef);
};

module.exports = {
  queryGroup,
  getGroupRef,
  getGroupData,
  setGroup,
  checkUser,
  format,
  getList,
  registerUser,
};
