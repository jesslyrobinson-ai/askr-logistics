import { useEffect, useState } from "react"
import "../App.css"

function AdminDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview")
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)

  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem("requests")) || []
    setRequests(savedRequests)
  }, [])

  const updateRequestStatus = (id, status) => {
    const updated = requests.map((request) =>
      request.id === id ? { ...request, status } : request
    )

    setRequests(updated)
    localStorage.setItem("requests", JSON.stringify(updated))

    if (selectedRequest?.id === id) {
      setSelectedRequest({ ...selectedRequest, status })
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "Pending")

  const queueCards = [
    { title: "Orders to Ship", count: 3, icon: "🚚" },
    { title: "Late Orders", count: 3, icon: "⏰" },
    { title: "Open Shipments", count: 0, icon: "📦" },
    { title: "Ready for Dispatch", count: 5, icon: "✅" },
    { title: "Missing Invoices", count: 2, icon: "🧾" },
    { title: "Pending Customer Requests", count: pendingRequests.length, icon: "📩" },
    { title: "Customer Issues", count: 1, icon: "🎧" },
    { title: "Storage Expiring", count: 4, icon: "⚠️" },
  ]

  const customers = [
    ["JS", "Jessly Robinson", "jessly@email.com", 5, "Active"],
    ["AS", "Andrew Seymour", "andrew@email.com", 2, "Active"],
    ["RP", "Robert Parker", "robert@email.com", 4, "Pending"],
    ["LT", "Lisa Thompson", "lisa@email.com", 7, "Active"],
  ]

  const packages = [
    ["PKG-12345", "Jessly Robinson", "Amazon", "Missing Invoice"],
    ["PKG-88721", "Andrew Seymour", "Nike", "Awaiting Consolidation"],
    ["PKG-55219", "Robert Parker", "Apple", "Ready for Dispatch"],
    ["PKG-33091", "Lisa Thompson", "Shein", "New Arrival"],
  ]

  const dispatch = [
    ["PKG-2025-0421", "Jessly Robinson", "Miami, FL", "UPS", "Ready for Dispatch"],
    ["PKG-2025-0420", "Andrew Seymour", "Fort Lauderdale, FL", "FedEx", "Awaiting Carrier"],
    ["PKG-2025-0419", "Robert Parker", "Orlando, FL", "DHL", "Out for Delivery"],
    ["PKG-2025-0418", "Lisa Thompson", "Miami Beach, FL", "UPS", "Out for Delivery"],
    ["PKG-2025-0417", "David Chen", "Hollywood, FL", "FedEx", "Delivered"],
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

        <button onClick={onLogout} className="confirm-btn">Logout</button>

        <nav>
          <button className={activePage === "overview" ? "active" : ""} onClick={() => setActivePage("overview")}>Overview</button>
          <button className={activePage === "customers" ? "active" : ""} onClick={() => setActivePage("customers")}>Customers</button>
          <button className={activePage === "packages" ? "active" : ""} onClick={() => setActivePage("packages")}>Packages</button>
          <button className={activePage === "dispatch" ? "active" : ""} onClick={() => setActivePage("dispatch")}>Dispatch</button>
          <button>Support</button>
        </nav>
      </aside>

      {activePage === "overview" && (
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
            <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80" alt="Warehouse" />
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
              <h2>Customer Requests</h2>

              {requests.length === 0 && (
                <div className="task-card">
                  <div>
                    <h3>No customer requests yet</h3>
                    <p>Requests from the client dashboard will appear here.</p>
                  </div>
                </div>
              )}

              {requests.map((request) => (
                <div className="task-card" key={request.id}>
                  <div>
                    <h3>{request.type}</h3>
                    <p>{request.customer} • {request.date}</p>
                  </div>

                  <div>
                    <span className={request.status === "Completed" ? "status success" : "status pending"}>
                      {request.status}
                    </span>

                    <button
                      className="confirm-btn"
                      style={{ marginLeft: "10px" }}
                      onClick={() => setSelectedRequest(request)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h2>Request Details</h2>

              {!selectedRequest && (
                <div className="task-card">
                  <div>
                    <h3>Select a request</h3>
                    <p>Click View Details to manage a customer request.</p>
                  </div>
                </div>
              )}

              {selectedRequest && (
                <>
                  <div className="task-card">
                    <div>
                      <h3>{selectedRequest.type}</h3>
                      <p>{selectedRequest.customer}</p>
                    </div>
                    <span className={selectedRequest.status === "Completed" ? "status success" : "status pending"}>
                      {selectedRequest.status}
                    </span>
                  </div>

                  <div className="detail-row">
                    <span>Email</span>
                    <strong>{selectedRequest.email}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Date</span>
                    <strong>{selectedRequest.date}</strong>
                  </div>

                  <div className="detail-row">
                    <span>Status</span>
                    <strong>{selectedRequest.status}</strong>
                  </div>

                  {selectedRequest.status === "Pending" && (
                    <button
                      className="confirm-btn"
                      style={{ marginTop: "16px" }}
                      onClick={() => updateRequestStatus(selectedRequest.id, "Completed")}
                    >
                      Mark Done
                    </button>
                  )}
                </>
              )}
            </div>
          </section>
        </main>
      )}

      {activePage === "customers" && (
        <main className="main-content">
          <div className="topbar">
            <div>
              <h1>Customers</h1>
              <p>Manage your customers, view their activity, and track their shipping history.</p>
            </div>
          </div>

          <section className="admin-hero">
            <div>
              <h2>Customer Management</h2>
              <p>View customer activity and manage all requests from one place.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&w=900&q=80" alt="Warehouse shelves" />
          </section>

          <section className="queue-grid" style={{ marginBottom: "24px" }}>
            <div className="queue-card"><div className="queue-icon">👥</div><h3>1,248</h3><p>Total Customers</p></div>
            <div className="queue-card"><div className="queue-icon">✅</div><h3>983</h3><p>Active Customers</p></div>
            <div className="queue-card"><div className="queue-icon">⏱️</div><h3>{pendingRequests.length}</h3><p>Pending Requests</p></div>
            <div className="queue-card"><div className="queue-icon">📦</div><h3>18</h3><p>Package Issues</p></div>
          </section>

          <section className="card">
            <div className="topbar">
              <h2>Customer List</h2>
              <input className="search-input" placeholder="Search customers..." />
            </div>

            <table className="customer-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Packages</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c[1]}>
                    <td><strong>{c[0]}</strong> {c[1]}</td>
                    <td>{c[2]}</td>
                    <td>{c[3]}</td>
                    <td><span className={c[4] === "Active" ? "status success" : "status pending"}>{c[4]}</span></td>
                    <td><button className="confirm-btn">View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {activePage === "packages" && (
        <main className="main-content">
          <div className="topbar">
            <div>
              <h1>Packages</h1>
              <p>Track package flow from arrival to dispatch.</p>
            </div>
          </div>

          <section className="admin-hero">
            <div>
              <h2>Package Flow</h2>
              <p>Manage arrivals, invoices, consolidation, and dispatch readiness.</p>
            </div>
            <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=80" alt="Delivery truck" />
          </section>

          <section className="queue-grid" style={{ marginBottom: "24px" }}>
            <div className="queue-card"><div className="queue-icon">📥</div><h3>14</h3><p>New Arrivals</p></div>
            <div className="queue-card"><div className="queue-icon">🧾</div><h3>2</h3><p>Missing Invoice</p></div>
            <div className="queue-card"><div className="queue-icon">📦</div><h3>{pendingRequests.length}</h3><p>Requests</p></div>
            <div className="queue-card"><div className="queue-icon">🚚</div><h3>5</h3><p>Ready Dispatch</p></div>
          </section>

          <section className="card">
            <div className="topbar">
              <h2>Package List</h2>
              <input className="search-input" placeholder="Search packages..." />
            </div>

            <table className="customer-table">
              <thead>
                <tr><th>Package ID</th><th>Customer</th><th>Store</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {packages.map((p) => (
                  <tr key={p[0]}>
                    <td><strong>{p[0]}</strong></td>
                    <td>{p[1]}</td>
                    <td>{p[2]}</td>
                    <td><span className="status pending">{p[3]}</span></td>
                    <td><button className="confirm-btn">Manage</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}

      {activePage === "dispatch" && (
        <main className="main-content">
          <div className="topbar">
            <div>
              <h1>Dispatch</h1>
              <p>Manage ready shipments, carrier assignments, and proof of dispatch.</p>
            </div>
          </div>

          <section className="admin-hero">
            <div>
              <h2>Dispatch Control</h2>
              <p>Monitor shipment readiness, assign trusted carriers, and keep delivery flow organized.</p>
              <button className="confirm-btn">Create New Dispatch</button>
            </div>

            <img
              src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=900&q=80"
              alt="Dispatch truck"
            />
          </section>

          <section className="queue-grid" style={{ marginBottom: "24px" }}>
            <div className="queue-card"><div className="queue-icon">📦</div><h3>28</h3><p>Ready for Dispatch</p></div>
            <div className="queue-card"><div className="queue-icon">⏱️</div><h3>16</h3><p>Awaiting Carrier</p></div>
            <div className="queue-card"><div className="queue-icon">🚚</div><h3>54</h3><p>Out for Delivery</p></div>
            <div className="queue-card"><div className="queue-icon">✅</div><h3>87</h3><p>Delivered Today</p></div>
          </section>

          <section className="card">
            <div className="topbar">
              <h2>Dispatch Queue</h2>
              <input className="search-input" placeholder="Search dispatch..." />
            </div>

            <table className="customer-table">
              <thead>
                <tr>
                  <th>Package ID</th>
                  <th>Customer</th>
                  <th>Destination</th>
                  <th>Carrier</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {dispatch.map((d) => (
                  <tr key={d[0]}>
                    <td><strong>{d[0]}</strong></td>
                    <td>{d[1]}</td>
                    <td>{d[2]}</td>
                    <td>{d[3]}</td>
                    <td><span className={d[4] === "Delivered" ? "status success" : "status pending"}>{d[4]}</span></td>
                    <td><button className="confirm-btn">View Details</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      )}
    </div>
  )
}

export default AdminDashboard