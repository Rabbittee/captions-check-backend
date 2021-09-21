const getUser = async (userRef, fields = ["displayName"]) => {
  const user = await userRef.get();
  return fields.reduce((obj, key) => {
    obj[key] = user.get(key);
    return obj;
  }, {});
};

exports.getUser = getUser;
