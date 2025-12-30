"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "linear-gradient(135deg, #fff1eb 0%, #ffe4d1 40%, #ffd3a5 70%, #ffffff 100%)",
      }}
    >
      <div
        className="card border-0 rounded-4 p-5"
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
        }}
      >
        <h3 className="fw-bold text-center mb-4">Create Account</h3>

        <input
          className="form-control mb-3"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn w-100 text-white fw-semibold"
          style={{
            background: "linear-gradient(90deg, #ff8a00, #ffb347)",
            border: "none",
          }}
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
}
