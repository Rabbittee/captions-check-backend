const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const router = express.Router();

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

  const writeResult = await admin.firestore().collection("groups").add(data);

  res.json({ result: `Group with ID: ${writeResult.id} Created.` });
});

module.exports = router;
