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

// middlewares
app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

// routers
app.use("/groups", groups);
exports.app = functions.https.onRequest(app);

// triggers
exports.createUser = functions.auth.user().onCreate(users.createUser);
