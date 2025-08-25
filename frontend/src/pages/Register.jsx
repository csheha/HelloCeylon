import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { Link } from "react-router-dom";
import "../style/Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header text-center">
          <h2 className="auth-title text-gradient">✨ Create Your Account</h2>
          <p className="auth-subtitle">
            Join HelloCeylon and start chatting today 🚀
          </p>
        </header>
        <form className="auth-form" onSubmit={handleRegister}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="auth-button" type="submit">
            Create Account
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

        <hr className="auth-divider" />
        <button className="google-button" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="currentColor"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v1.7h2.6c1.53-1.4 2.41-3.5 2.41-6-.01-.4-.04-.8-.16-1.18l.12-.56z"
            />
            <path
              fill="currentColor"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-1.7c-.73.5-1.67.78-2.7.78-2.08 0-3.84-1.4-4.48-3.29H1.83v1.76C3.16 15.48 5.9 17 8.98 17z"
            />
            <path
              fill="currentColor"
              d="M4.5 10.85c-.16-.5-.25-1.03-.25-1.58s.09-1.08.25-1.58V5.93H1.83C1.31 6.96 1 8.13 1 9.35s.31 2.39.83 3.42l2.67-1.92z"
            />
            <path
              fill="currentColor"
              d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3C12.94.68 11.13 0 8.98 0 5.9 0 3.16 1.52 1.83 3.93l2.67 1.92c.64-1.89 2.4-3.27 4.48-3.27z"
            />
          </svg>
          Sign up with Google
        </button>
      </div>
    </div>
  );
}
