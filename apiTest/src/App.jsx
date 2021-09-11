import React from "react";
import { signInWithGoogle } from "./lib/firebase";

function App() {
  return (
    <div className="App">
      <button className="" onClick={signInWithGoogle}>
        Login with Google
      </button>
    </div>
  );
}

export default App;
