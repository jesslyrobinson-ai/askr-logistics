import "../App.css"

function AdminDashboard({ user, onLogout }) {
  const queueCards = [
    { title: "Orders to Ship", count: 3, icon: "🚚" },
    { title: "Late Orders", count: 3, icon: "⏰" },
    { title: "Open Shipments", count: 0, icon: "📦" },
    { title: "Ready for Dispatch", count: 5, icon: "✅" },
    { title: "Missing Invoices", count: 2, icon: "🧾" },
    { title: "Pending Consolidation", count: 3, icon: "📦" },
    { title: "Customer Issues", count: 1, icon: "🎧" },
    { title: "Storage Expiring", count: 4, icon: "⚠️" },
  ]

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
            <p>Operations overview for packages, requests, dispatch, and support.</p>
          </div>
        </div>

        <section className="admin-hero">
          <div>
            <h2>Operations Queue</h2>
            <p>Everything your staff needs to handle next.</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80"
            alt="Warehouse"
          />
        </section>

        <section className="queue-section">
          <h2>Pending Actions</h2>

          <div className="queue-grid">
            {queueCards.map((card) => (
              <div className="queue-card" key={card.title}>
                <div className="queue-icon">{card.icon}</div>
                <h3>{card.count}</h3>
                <p>{card.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-grid">
          <div className="card">
            <h2>Active Tasks</h2>

            <div className="task-card">
              <div>
                <h3>Consolidation Request</h3>
                <p>Jessly Robinson • PKG-12345</p>
              </div>
              <span className="status pending">Pending</span>
            </div>

            <div className="task-card">
              <div>
                <h3>Missing Invoice</h3>
                <p>Customer needs invoice upload</p>
              </div>
              <span className="status warning">Needs Action</span>
            </div>
          </div>

          <div className="card">
            <h2>Support Center</h2>

            <div className="task-card">
              <div>
                <h3>Package Issue</h3>
                <p>Customer asked for proof photo</p>
              </div>
              <button className="confirm-btn">View</button>
            </div>

            <div className="task-card">
              <div>
                <h3>Dispatch Question</h3>
                <p>Customer waiting for update</p>
              </div>
              <button className="confirm-btn">Reply</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default AdminDashboard