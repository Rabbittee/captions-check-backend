const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const express = require("express");

const {
  cookieParser,
  cors,
  validateFirebaseIdToken,
} = require("./util/middleware");

const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);
app.get("/hello", (req, res) => {
  res.send(`Hello ${req.user.name}`);
});

exports.app = functions.https.onRequest(app);
