const admin = require("firebase-admin");
const chai = require("chai");

const test = require("firebase-functions-test")();
const assert = chai.assert;
const myFunctions = require("../index");

describe("Cloud Functions", () => {
  after(() => {
    test.cleanup();
  });

  it("tests an Auth function that interacts with Firestore", async () => {
    const wrapped = test.wrap(myFunctions.createUser);

    const uid = `${new Date().getTime()}`;
    const email = `user-${uid}@example.com`;
    const user = test.auth.makeUserRecord({
      providerData: [{ providerId: uid }],
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
  }).timeout(30000);
});
