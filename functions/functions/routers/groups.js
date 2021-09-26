const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const { Group, User } = require("../models");

// create group
router.post("/", async (req, res) => {
  let doc = await Group.queryGroup(req.body.name);
  if (!doc.empty) {
    res
      .status(400)
      .json({ type: "DUPLICATED_VALUE", msg: `Group: ${req.body.name} exist` });
    return;
  }

  const groupRef = await Group.getGroupRef();
  const data = {
    id: groupRef.id,
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic || true,
    createDate: admin.firestore.Timestamp.fromDate(new Date()),
    manager: req.user.userRef,
    members: [req.user.userRef],
  };

  await Group.setGroup(groupRef, data);
  await User.joinGroup(req.user.userRef, groupRef);

  const group = await Group.getGroupData(groupRef, false);
  return res.json(group);
});

// get group list
router.get("/", async (req, res) => {
  const { name } = req.query;
  if (!req.user.admin) {
    res.status(400).json({ type: "PERMISSION_DENIED", msg: "" });
  }
  let groups = await Group.getList(name);

  res.json(groups);
  return;
});

// register to group
router.post("/register", async (req, res) => {
  const { groupId } = req.body;
  const groupRef = Group.getGroupRef(groupId);
  let group = await Group.getGroupData(groupRef, { raw: true });

  try {
    await Group.registerUser(group, req.user);
  } catch (error) {
    res.status(400).json(error);
    return;
  }

  group = await Group.getGroupData(groupRef, { addRef: false });
  res.json(group);
  return;
});

// get group info
router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  const groupRef = Group.getGroupRef(groupId);
  const group = await Group.getGroupData(groupRef, {
    addRef: false,
    raw: true,
  });

  if (group === undefined) {
    res
      .status(400)
      .json({ type: "DUPLICATED_VALUE", msg: `NO GROUP: ${groupId}` });
    return;
  }
  if (!Group.checkUser(group, req.user)) {
    res
      .status(400)
      .json({ type: "PERMISSION_DENIED", msg: `you are not in this group` });
    return;
  }

  res.json(await Group.format(group));
});

module.exports = router;
