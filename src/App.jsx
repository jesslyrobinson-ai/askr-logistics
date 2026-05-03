import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"
import Login from "./pages/Login"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("askr_logged_in") === "true"
  )

  const user = JSON.parse(localStorage.getItem("askr_user"))

  function handleLogin() {
    localStorage.setItem("askr_logged_in", "true")
    setIsLoggedIn(true)
  }

  function handleLogout() {
    localStorage.removeItem("askr_logged_in")
    setIsLoggedIn(false)
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />
  }

  if (user?.role === "admin") {
    return <AdminDashboard user={user} onLogout={handleLogout} />
  }

  return <Dashboard user={user} onLogout={handleLogout} />
}

export default App