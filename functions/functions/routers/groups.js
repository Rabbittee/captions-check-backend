const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const db = admin.firestore();

// create group
router.post("/", async (req, res) => {
  const data = {
    name: req.body.name,
    description: req.body.description,
    isPublic: req.body.isPublic || true,
    createDate: new Date(),
    manager: req.user.user_id,
    members: [req.user.user_id],
  };

  const groupsRef = db.collection("groups");
  const allGroupRes = await groupsRef.where("name", "==", data.name).get();
  if (!allGroupRes.empty) {
    allGroupRes.forEach((doc) => {
      functions.logger.warn(doc.id, "=>", doc.data());
    });
    return res.json({ result: `Group: ${data.name} exist` });
  }

  const writeResult = await groupsRef.add(data);
  res.json({ result: `Group with ID: ${writeResult.id} Created.` });
});

module.exports = router;
