import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function submit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must contain 6 characters");
      return;
    }

    login(email);

    navigate(
      location.state?.from?.pathname || "/member"
    );
  }

  return (
    <div className="login-card">

      <h1>🔐 Member Login</h1>

      <form onSubmit={submit}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button className="primary-btn">
          Login
        </button>

      </form>

    </div>
  );
}