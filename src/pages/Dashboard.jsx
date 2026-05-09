import { useEffect, useState } from "react"
import "../App.css"

function Dashboard({ user, onLogout }) {
  const [selectedPackage, setSelectedPackage] = useState("12345")
  const [activeAction, setActiveAction] = useState(null)
  const [activePage, setActivePage] = useState("packages")
  const [requests, setRequests] = useState([])
  const [packageStatuses, setPackageStatuses] = useState({})

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || [])
    setPackageStatuses(JSON.parse(localStorage.getItem("packageStatuses")) || {})
  }, [])

  const basePackages = [
    {
      id: "12345",
      store: "Amazon",
      tracking: "1Z999AA10123456784",
      status: "Received",
      weight: "3.2 lbs",
      dimensions: "12 x 10 x 8 in",
      received: "May 20, 2025",
      storageDays: "13 days",
      location: "A-12-03",
    },
    {
      id: "67890",
      store: "Nike",
      tracking: "9400111206213890000000",
      status: "In Storage",
      weight: "5.1 lbs",
      dimensions: "16 x 12 x 10 in",
      received: "May 19, 2025",
      storageDays: "12 days",
      location: "B-08-11",
    },
  ]

  const packages = basePackages.map((pkg) => ({
    ...pkg,
    status: packageStatuses[pkg.id] || pkg.status,
  }))

  const currentPackage = packages.find((pkg) => pkg.id === selectedPackage)

  const createRequest = (type) => {
    const saved = JSON.parse(localStorage.getItem("requests")) || []

    const pendingStatus =
      type.includes("Consolidation") ? "Consolidation Pending" :
      type.includes("Invoice") ? "Invoice Pending" :
      type.includes("Dispatch") ? "Dispatch Pending" :
      type.includes("Hold") ? "Storage Pending" :
      "Request Pending"

    const updatedStatuses = {
      ...packageStatuses,
      [currentPackage.id]: pendingStatus,
    }

    const newRequest = {
      id: Date.now(),
      type,
      customer: user?.name || "Customer",
      email: user?.email || "customer@email.com",
      packageId: currentPackage.id,
      packageStore: currentPackage.store,
      status: "Pending",
      date: new Date().toLocaleString(),
    }

    const updatedRequests = [newRequest, ...saved]

    localStorage.setItem("requests", JSON.stringify(updatedRequests))
    localStorage.setItem("packageStatuses", JSON.stringify(updatedStatuses))

    setRequests(updatedRequests)
    setPackageStatuses(updatedStatuses)

    alert(`${type} submitted successfully`)
  }

  const clearCompletedRequests = () => {
    const updated = requests.filter((request) => request.status !== "Completed")
    localStorage.setItem("requests", JSON.stringify(updated))
    setRequests(updated)
  }

  const activeRequests = requests.filter((request) => request.status !== "Completed")
  const completedRequests = requests.filter((request) => request.status === "Completed")

  const receivedCount = packages.filter((pkg) => pkg.status === "Received").length
  const storageCount = packages.filter((pkg) => pkg.status === "In Storage").length
  const readyCount = packages.filter((pkg) => pkg.status === "Ready for Dispatch").length

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📦</div>
          <div><h2>ASKR</h2><p>Logistics</p></div>
        </div>

        <p style={{ marginTop: "20px", fontWeight: "600" }}>
          Welcome, {user?.name}
        </p>

        <button onClick={onLogout} className="confirm-btn" style={{ marginTop: "10px" }}>
          Logout
        </button>

        <nav>
          <a className={activePage === "packages" ? "active" : ""} onClick={() => setActivePage("packages")}>Packages</a>
          <a className={activePage === "consolidation" ? "active" : ""} onClick={() => setActivePage("consolidation")}>Consolidation</a>
          <a className={activePage === "dispatch" ? "active" : ""} onClick={() => setActivePage("dispatch")}>Dispatch</a>
          <a className={activePage === "invoices" ? "active" : ""} onClick={() => setActivePage("invoices")}>Invoices</a>
          <a className={activePage === "history" ? "active" : ""} onClick={() => setActivePage("history")}>History</a>
          <a className={activePage === "profile" ? "active" : ""} onClick={() => setActivePage("profile")}>My Profile</a>
          <a className={activePage === "support" ? "active" : ""} onClick={() => setActivePage("support")}>Support</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        {activePage === "packages" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>My Packages</h1>
                <p>Manage received packages, consolidation, storage, invoices, and dispatch requests.</p>
              </div>
              <button className="primary-btn" onClick={() => createRequest("General Package Request")}>
                New Request
              </button>
            </header>

            <section className="stats-grid">
              <div className="stat-card blue"><div className="stat-icon">📦</div><div><h3>{receivedCount}</h3><p>Packages Received</p></div></div>
              <div className="stat-card green"><div className="stat-icon">🏬</div><div><h3>{storageCount}</h3><p>In Storage</p></div></div>
              <div className="stat-card orange"><div className="stat-icon">⬇️</div><div><h3>{readyCount}</h3><p>Ready for Dispatch</p></div></div>
              <div className="stat-card purple"><div className="stat-icon">🚚</div><div><h3>{completedRequests.length}</h3><p>Completed Jobs</p></div></div>
            </section>

            <section className="dashboard-grid">
              <div>
                <div className="packages-card">
                  <div className="section-title">
                    <h2>Available Packages</h2>
                    <p>Select a package to view details and actions.</p>
                  </div>

                  <table>
                    <thead>
                      <tr><th>Package</th><th>Store</th><th>Status</th><th>Weight</th><th>Received</th><th>Storage</th></tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={selectedPackage === pkg.id ? "selected-row" : ""}>
                          <td>#{pkg.id}</td>
                          <td>{pkg.store}</td>
                          <td><span className="status-badge storage">{pkg.status}</span></td>
                          <td>{pkg.weight}</td>
                          <td>{pkg.received}</td>
                          <td>{pkg.storageDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeRequests.length > 0 && (
                  <section className="workflow-card">
                    <div className="workflow-header">
                      <h2>Your Active Requests</h2>
                      <p>Pending requests sent to admin.</p>
                    </div>

                    <div className="workflow-body">
                      {activeRequests.map((r) => (
                        <div className="task-card" key={r.id}>
                          <div>
                            <h3>{r.type}</h3>
                            <p>Package #{r.packageId} • {r.packageStore} • {r.date}</p>
                          </div>
                          <span className="status pending">{r.status}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              <aside className="details-panel">
                <div className="package-top">
                  <p className="small-label">Store</p>
                  <h3>{currentPackage.store}</h3>
                  <p className="tracking">Tracking # {currentPackage.tracking}</p>
                </div>

                <div className="package-images">
                  <div className="main-package-img">📦</div>
                  <div className="mini-images"><div>📦</div><div>+2</div></div>
                </div>

                <div className="detail-section">
                  <h4>Package Details</h4>
                  <div className="detail-row"><span>Status</span><strong>{currentPackage.status}</strong></div>
                  <div className="detail-row"><span>Weight</span><strong>{currentPackage.weight}</strong></div>
                  <div className="detail-row"><span>Dimensions</span><strong>{currentPackage.dimensions}</strong></div>
                  <div className="detail-row"><span>Received</span><strong>{currentPackage.received}</strong></div>
                  <div className="detail-row"><span>Storage Days</span><strong>{currentPackage.storageDays}</strong></div>
                  <div className="detail-row"><span>Location</span><strong>{currentPackage.location}</strong></div>
                </div>

                <div className="actions-section">
                  <h4>Actions</h4>
                  <button onClick={() => setActivePage("consolidation")}><span>📦</span><div><strong>Request Consolidation</strong><p>Combine with other packages</p></div><b>›</b></button>
                  <button onClick={() => setActiveAction("invoice")}><span>📄</span><div><strong>Upload Invoice</strong><p>Upload store or purchase invoice</p></div><b>›</b></button>
                  <button onClick={() => setActiveAction("hold")}><span>⏸️</span><div><strong>Hold / Store</strong><p>Hold this package in warehouse</p></div><b>›</b></button>
                </div>
              </aside>
            </section>
          </>
        )}

        {activePage === "history" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>History</h1>
                <p>View completed jobs and past requests.</p>
              </div>

              {completedRequests.length > 0 && (
                <button className="primary-btn" onClick={clearCompletedRequests}>
                  Clear History
                </button>
              )}
            </header>

            <section className="workflow-card">
              <div className="workflow-header">
                <h2>Completed Jobs</h2>
                <p>All completed requests will appear here.</p>
              </div>

              <div className="workflow-body">
                {completedRequests.length === 0 && (
                  <div className="task-card">
                    <div>
                      <h3>No completed jobs yet</h3>
                      <p>When admin marks a request done, it will appear here.</p>
                    </div>
                  </div>
                )}

                {completedRequests.map((r) => (
                  <div className="task-card" key={r.id}>
                    <div>
                      <h3>{r.type}</h3>
                      <p>Package #{r.packageId} • {r.packageStore} • {r.date}</p>
                    </div>
                    <span className="status success">Completed</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activePage === "consolidation" && (
          <>
            <header className="dashboard-header">
              <div><h1>Consolidation</h1><p>Manage package consolidation options and submit consolidation requests.</p></div>
              <button className="primary-btn" onClick={() => createRequest("Consolidation Request")}>New Consolidation</button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header"><h2>Consolidation Options</h2><p>Choose how you want your packages handled.</p></div>
              <div className="workflow-body">
                {packages.map((pkg) => <label key={pkg.id}><input type="checkbox" /> Package #{pkg.id} - {pkg.store} ({pkg.weight})</label>)}
                <textarea placeholder="Special instructions for consolidation..."></textarea>
                <button className="confirm-btn" onClick={() => createRequest("Consolidation Request")}>Submit Consolidation Request</button>
              </div>
            </section>
          </>
        )}

        {activePage === "dispatch" && (
          <>
            <header className="dashboard-header">
              <div><h1>Dispatch</h1><p>Select packages, choose shipping options, and submit a dispatch request.</p></div>
              <button className="primary-btn" onClick={() => createRequest("Dispatch Request")}>New Dispatch</button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header"><h2>Request Dispatch</h2><p>Choose which packages you want shipped.</p></div>
              <div className="workflow-body">
                {packages.map((pkg) => <label key={pkg.id}><input type="checkbox" /> Package #{pkg.id} - {pkg.store} ({pkg.weight})</label>)}
                <select><option>Select carrier</option><option>DHL</option><option>FedEx</option><option>UPS</option></select>
                <select><option>Select shipping speed</option><option>Standard</option><option>Express</option><option>Priority</option></select>
                <textarea placeholder="Delivery instructions or special notes..."></textarea>
                <button className="confirm-btn" onClick={() => createRequest("Dispatch Request")}>Submit Dispatch Request</button>
              </div>
            </section>
          </>
        )}

        {activePage === "invoices" && (
          <>
            <header className="dashboard-header">
              <div><h1>Invoices</h1><p>Upload, review, and manage package invoices.</p></div>
              <button className="primary-btn" onClick={() => createRequest("Invoice Upload")}>Upload Invoice</button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header"><h2>Upload Invoice</h2><p>Select a package and upload the store invoice or receipt.</p></div>
              <div className="workflow-body">
                <select>
                  <option>Select package</option>
                  {packages.map((pkg) => <option key={pkg.id}>Package #{pkg.id} - {pkg.store}</option>)}
                </select>
                <label>Upload invoice<input type="file" /></label>
                <textarea placeholder="Add invoice notes or item details..."></textarea>
                <button className="confirm-btn" onClick={() => createRequest("Invoice Upload")}>Submit Invoice</button>
              </div>
            </section>
          </>
        )}

        {activePage === "profile" && (
          <header className="dashboard-header">
            <div><h1>My Profile</h1><p>Manage your personal information, address, and package labels.</p></div>
            <button className="primary-btn">New Request</button>
          </header>
        )}

        {activePage === "support" && (
          <>
            <header className="dashboard-header">
              <div><h1>Support</h1><p>Get help, submit requests, and track support tickets.</p></div>
              <button className="primary-btn" onClick={() => createRequest("Support Ticket")}>New Ticket</button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header"><h2>Create Support Request</h2><p>Submit a new issue or question.</p></div>
              <div className="workflow-body">
                <select>
                  <option>Select issue</option>
                  <option>Missing item</option>
                  <option>Damaged package</option>
                  <option>Billing issue</option>
                  <option>General question</option>
                </select>
                <textarea placeholder="Describe your issue..." />
                <button className="confirm-btn" onClick={() => createRequest("Support Ticket")}>Submit Ticket</button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard