const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const db = admin.firestore();
const groupsRef = db.collection("groups");

// create group
router.post("/", async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic || true,
    createDate: admin.firestore.Timestamp.fromDate(new Date()),
    manager: req.user.user_id,
    members: [req.user.user_id],
  };

  const groupRes = await groupsRef.doc(data.name);
  let doc = await groupRes.get();
  if (doc.exists) {
    return res.status(400).json({ error: `Group: ${data.name} exist` });
  }

  await groupRes.set(data);
  doc = await groupRes.get();
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
