const admin = require("firebase-admin");
const chai = require("chai");
const sinon = require("sinon");

const test = require("firebase-functions-test")();
const assert = chai.assert;

describe("Cloud Functions", () => {
  let myFunctions, adminInitStub;

  before(() => {
    adminInitStub = sinon.stub(admin, "initializeApp");
    myFunctions = require("../index");
  });

  after(() => {
    adminInitStub.restore();
    test.cleanup();
  });

  describe("User", async () => {
    it("tests an Auth function that interacts with Firestor", async () => {
      const wrapped = test.wrap(myFunctions.createUser);

      const uid = `${new Date().getTime()}`;
      const email = `user-${uid}@example.com`;
      const user = test.auth.makeUserRecord({
        uid,
        email,
      });

      // Call the function
      await wrapped(user);

      //   Check the data was written to the Firestore emulator
      const snap = await admin.firestore().collection("users").doc(email).get();
      const data = snap.data();

      assert.equal(data.uid, uid);
      assert.equal(data.email, email);
    });
  }).timeout(5000);
});
