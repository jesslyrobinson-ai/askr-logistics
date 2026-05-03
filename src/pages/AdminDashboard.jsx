import "../App.css"

function AdminDashboard({ user, onLogout }) {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📦</div>
          <div>
            <h2>ASKR</h2>
            <p>Logistics</p>
          </div>
        </div>

        <p style={{ marginTop: "20px", fontWeight: "600" }}>
          Admin: {user?.name}
        </p>

        <button onClick={onLogout} className="confirm-btn">
          Logout
        </button>

        <nav>
          <button className="active">Overview</button>
          <button>Customers</button>
          <button>Packages</button>
          <button>Dispatch</button>
          <button>Support</button>
        </nav>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage customers, packages, dispatch, and support.</p>
          </div>
        </div>

        {/* ✅ STATS */}
        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p>2,458</p>
          </div>

          <div className="stat-card">
            <h3>Packages</h3>
            <p>1,342</p>
          </div>

          <div className="stat-card">
            <h3>Pending Dispatch</h3>
            <p>278</p>
          </div>

          <div className="stat-card">
            <h3>Tickets</h3>
            <p>36</p>
          </div>
        </section>

        {/* ✅ 2 COLUMN GRID */}
        <div className="admin-grid">

          {/* LEFT: PACKAGES */}
          <div className="card">
            <h2>Recent Packages</h2>

            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>📦 PKG-1234</td>
                  <td>Jessly</td>
                  <td>Warehouse</td>
                  <td><button className="confirm-btn">View</button></td>
                </tr>

                <tr>
                  <td>👟 PKG-5678</td>
                  <td>Drew</td>
                  <td>Dispatch</td>
                  <td><button className="confirm-btn">View</button></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* RIGHT: DISPATCH */}
          <div className="card">
            <h2>Pending Dispatch</h2>

            <table>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Destination</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PKG-7788</td>
                  <td>USA</td>
                  <td><button className="confirm-btn">Approve</button></td>
                </tr>

                <tr>
                  <td>PKG-8899</td>
                  <td>UK</td>
                  <td><button className="confirm-btn">Approve</button></td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  )
}

export default AdminDashboard