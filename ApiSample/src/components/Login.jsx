import React from "react";
import { signInWithGoogle } from "../lib/firebase";
import { Icon } from ".";

export function Login() {
  return (
    <button
      className="flex border-solid border-2 border-blue-400 bg-blue-400"
      onClick={signInWithGoogle}
    >
      <Icon.Google className="h-12 p-3 bg-white" />
      <span className="py-2 px-4 leading-8 font-black text-white">
        Sign in with Google
      </span>
    </button>
  );
}
