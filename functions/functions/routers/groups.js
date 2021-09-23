const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const { groupsRef, usersRef } = require("../models");
const Group = require("../models/Group");

// create group
router.post("/", async (req, res) => {
  const userRef = usersRef.doc(req.user.email);
  let doc = await groupsRef.where("name", "==", req.body.name).get();
  if (!doc.empty) {
    res
      .status(400)
      .json({ type: "DUPLICATED_VALUE", msg: `Group: ${req.body.name} exist` });
    return;
  }

  const groupRef = await groupsRef.doc();
  const data = {
    id: groupRef.id,
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic || true,
    createDate: admin.firestore.Timestamp.fromDate(new Date()),
    manager: userRef,
    members: [userRef],
  };

  await groupRef.set(data);
  await userRef.update({
    groups: admin.firestore.FieldValue.arrayUnion(groupRef),
  });

  doc = await groupRef.get();
  res.json(await Group.getUser(doc.data()));
});

// get group list
router.get("/", async (req, res) => {
  const { name } = req.query;
  let snapshot = await Group.getList(name);

  if (snapshot.empty) {
    res.json([]);
    return;
  }

  const output = await Promise.all(
    snapshot.docs.map(async (doc) => await Group.getUser(doc.data()))
  );

  res.json(output);
});

// register to group
router.post("/register", async (req, res) => {
  const { groupId } = req.body;
  const userRef = usersRef.doc(req.user.email);

  const groupRef = groupsRef.doc(groupId);
  let group = await groupRef.get();
  const members = group.data().members;
  if (members.filter((memberRef) => memberRef.path == userRef.path).length) {
    res.status(400).json({
      type: "DUPLICATED_VALUE",
      msg: `member ${req.user.name} exist`,
    });
    return;
  }

  await groupRef.update({
    members: admin.firestore.FieldValue.arrayUnion(userRef),
  });

  group = await groupRef.get();
  res.json(await Group.getUser(group.data()));
});

// get group info
router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;
  // ToDo: check user permissions

  const doc = await groupsRef.doc(groupId).get();
  if (!doc.exists) {
    res
      .status(400)
      .json({ type: "DUPLICATED_VALUE", msg: `NO GROUP: ${groupId}` });
    return;
  }

  res.json(doc.data());
});

module.exports = router;
