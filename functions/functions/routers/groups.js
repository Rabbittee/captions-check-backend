const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const { groupsRef, usersRef } = require("../models");

// create group
router.post("/", async (req, res) => {
  const userRef = usersRef.doc(req.user.email);
  let doc = await groupsRef.where("name", "==", req.body.name).get();
  if (!doc.empty) {
    res.status(400).json({ error: `Group: ${req.body.name} exist` });
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
  res.json(doc.data());
});

// get group list
router.get("/", async (req, res) => {
  const { name } = req.query;
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
    return res.json({ result: [] });
  }

  res.json({ result: snapshot.docs.map((doc) => doc.data()) });
});

// register to group
router.post("/register", async (req, res) => {
  const { groupId } = req.body;
  const { user } = req;

  const groupRef = groupsRef.doc(groupId);
  const group = await groupRef.get();
  if (group.members.indexOf(user.user_id) > -1) {
    return res.json({ result: `member ${user.name} exist` });
  }

  const groupNew = await groupRef.update({
    members: group.members.concat([user.user_id]),
  });
  res.json({ result: groupNew.data() });
});

// get group info
router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;

  const doc = await groupsRef.doc(groupId).get();
  if (!doc.exists) {
    return res.json(`NO GROUP: ${groupId}`);
  }

  res.json(doc.data());
});

module.exports = router;
