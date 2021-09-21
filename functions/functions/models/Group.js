const User = require("./User");
const { groupsRef } = require(".");

const getUser = async (group) => {
  group.manager = await User.getUser(group.manager);
  group.members = await Promise.all(
    group.members.map(async (member) => {
      return await User.getUser(member);
    })
  );
  return group;
};

const getList = async (name) => {
  if (name != null) {
    return await groupsRef
      .orderBy("name")
      .startAt(name)
      .endAt(name + "\uf8ff")
      .get();
  }
  return await groupsRef.orderBy("name").get();
};

exports.getUser = getUser;
exports.getList = getList;
