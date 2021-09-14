import { initializeApp } from "firebase/app";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaBiazw0Awd6W6kRc8NMm_RZv_w68bix0",
  authDomain: "functions-test-6da7a.firebaseapp.com",
  projectId: "functions-test-6da7a",
  storageBucket: "functions-test-6da7a.appspot.com",
  messagingSenderId: "335942828220",
  appId: "1:335942828220:web:90a6f3e4d7094506c250b9",
  measurementId: "G-K5KVRX9NV1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
connectAuthEmulator(auth, "http://localhost:9099");

async function signInWithGoogle() {
  var provider = new GoogleAuthProvider();
  const res = await signInWithPopup(auth, provider);
  const user = res.user;
  console.log(user.accessToken);
}

export { signInWithGoogle };
