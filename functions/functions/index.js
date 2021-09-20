const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const express = require("express");

const {
  cookieParser,
  cors,
  validateFirebaseIdToken,
} = require("./util/middleware");

const groups = require("./routers/groups");
const users = require("./routers/users");

const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.get("/hello", (req, res) => {
  res.json(req.user);
});
app.use("/groups", groups);

exports.app = functions.https.onRequest(app);
exports.createUser = functions.auth.user().onCreate(users.createUser);
