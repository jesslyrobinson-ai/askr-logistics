import { useState } from "react"
import "../App.css"

function Login({ onLogin }) {
  const [mode, setMode] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  function handleSubmit() {
    if (mode === "signup") {
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill out all fields")
        return
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      const role = email === "admin@askr.com" ? "admin" : "customer"
      const user = { name, email, password, role }

      localStorage.setItem("askr_user", JSON.stringify(user))
      localStorage.setItem("askr_logged_in", "true")
      onLogin()
      return
    }

    const savedUser = JSON.parse(localStorage.getItem("askr_user"))

    if (savedUser && savedUser.email === email && savedUser.password === password) {
      localStorage.setItem("askr_user", JSON.stringify(savedUser))
      localStorage.setItem("askr_logged_in", "true")
      onLogin()
    } else {
      alert("Invalid email or password")
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="brand-icon large">📦</div>
        <h1>ASKR Logistics</h1>
        <p>
          Manage packages, invoices, dispatch, and support from one modern dashboard.
        </p>
      </div>

      <div className="login-card">
        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <p>
          {mode === "login"
            ? "Login to continue to your dashboard."
            : "Create your ASKR customer account."}
        </p>

        {mode === "signup" && (
          <>
            <label>Full Name</label>
            <input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}

        <label>Email</label>
        <input
          placeholder="customer@askr.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}

        <button onClick={handleSubmit} className="confirm-btn">
          {mode === "login" ? "Login" : "Create Account"}
        </button>

        <small>
          {mode === "login" ? "New customer? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            style={{
              border: "none",
              background: "none",
              color: "#2563eb",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {mode === "login" ? "Create account" : "Login"}
          </button>
        </small>
      </div>
    </div>
  )
}

export default Login