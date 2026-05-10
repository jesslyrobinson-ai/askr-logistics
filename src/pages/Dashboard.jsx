import { useEffect, useState } from "react"
import "../App.css"

function Dashboard({ user, onLogout }) {
  const [selectedPackage, setSelectedPackage] = useState("12345")
  const [activePage, setActivePage] = useState("packages")
  const [requests, setRequests] = useState([])
  const [packageStatuses, setPackageStatuses] = useState({})
  const [extraPackages, setExtraPackages] = useState([])
  const [selectedForConsolidation, setSelectedForConsolidation] = useState([])

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || [])
    setPackageStatuses(JSON.parse(localStorage.getItem("packageStatuses")) || {})
    setExtraPackages(JSON.parse(localStorage.getItem("extraPackages")) || [])
  }, [])

  const basePackages = [
    { id: "12345", store: "Amazon", tracking: "1Z999AA10123456784", status: "Received", weight: "3.2 lbs", dimensions: "12 x 10 x 8 in", received: "May 20, 2025", storageDays: "13 days", location: "A-12-03" },
    { id: "67890", store: "Nike", tracking: "9400111206213890000000", status: "In Storage", weight: "5.1 lbs", dimensions: "16 x 12 x 10 in", received: "May 19, 2025", storageDays: "12 days", location: "B-08-11" },
  ]

  const packages = [...basePackages, ...extraPackages].map((pkg) => ({
    ...pkg,
    status: packageStatuses[pkg.id] || pkg.status,
  }))

  const currentPackage = packages.find((pkg) => pkg.id === selectedPackage) || packages[0]

  const activeRequests = requests.filter((r) => r.status !== "Completed")
  const completedRequests = requests.filter((r) => r.status === "Completed")
  const consolidationGroups = JSON.parse(localStorage.getItem("consolidationGroups")) || []

  const receivedCount = packages.filter((p) => p.status === "Received").length
  const storageCount = packages.filter((p) => p.status.includes("Storage") || p.status === "In Storage").length
  const readyCount = packages.filter((p) => p.status === "Ready for Dispatch").length

  const simulateIncomingPackage = () => {
    const newPackage = {
      id: String(Date.now()).slice(-5),
      store: ["Shein", "Zara", "Amazon", "Nike"][Math.floor(Math.random() * 4)],
      tracking: "SIM-" + Date.now(),
      status: "Received",
      weight: "2.4 lbs",
      dimensions: "10 x 8 x 6 in",
      received: new Date().toLocaleDateString(),
      storageDays: "0 days",
      location: "NEW-" + Math.floor(Math.random() * 20),
    }

    const updated = [newPackage, ...extraPackages]
    localStorage.setItem("extraPackages", JSON.stringify(updated))
    setExtraPackages(updated)
    setSelectedPackage(newPackage.id)
  }

  const createRequest = (type, packageList = [currentPackage]) => {
    const saved = JSON.parse(localStorage.getItem("requests")) || []

    const newRequest = {
      id: Date.now(),
      type,
      customer: user?.name || "Customer",
      email: user?.email || "customer@email.com",
      packageIds: packageList.map((p) => p.id),
      packageStores: packageList.map((p) => p.store),
      packageId: packageList[0]?.id,
      packageStore: packageList[0]?.store,
      status: "Pending",
      date: new Date().toLocaleString(),
    }

    const updatedStatuses = { ...packageStatuses }

    packageList.forEach((pkg) => {
      updatedStatuses[pkg.id] =
        type.includes("Consolidation") ? "Consolidation Pending" :
        type.includes("Invoice") ? "Invoice Pending" :
        type.includes("Dispatch") ? "Dispatch Pending" :
        type.includes("Hold") ? "Storage Pending" :
        "Request Pending"
    })

    const updatedRequests = [newRequest, ...saved]

    localStorage.setItem("requests", JSON.stringify(updatedRequests))
    localStorage.setItem("packageStatuses", JSON.stringify(updatedStatuses))

    setRequests(updatedRequests)
    setPackageStatuses(updatedStatuses)
    setSelectedForConsolidation([])

    alert(`${type} submitted successfully`)
  }

  const submitConsolidation = () => {
    const selectedPackages = packages.filter((pkg) =>
      selectedForConsolidation.includes(pkg.id)
    )

    if (selectedPackages.length < 2) {
      alert("Select at least 2 packages to consolidate")
      return
    }

    createRequest("Consolidation Request", selectedPackages)
  }

  const toggleConsolidationPackage = (id) => {
    setSelectedForConsolidation((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const clearCompletedRequests = () => {
    const updated = requests.filter((request) => request.status !== "Completed")
    localStorage.setItem("requests", JSON.stringify(updated))
    setRequests(updated)
  }

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

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="primary-btn" onClick={() => createRequest("General Package Request")}>New Request</button>
                <button className="primary-btn" onClick={simulateIncomingPackage}>+ Incoming Package</button>
              </div>
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

                {consolidationGroups.length > 0 && (
                  <section className="workflow-card">
                    <div className="workflow-header">
                      <h2>Consolidation Groups</h2>
                      <p>Packages that have been consolidated together.</p>
                    </div>

                    <div className="workflow-body">
                      {consolidationGroups.map((group) => (
                        <div className="task-card" key={group.id}>
                          <div>
                            <h3>{group.id}</h3>
                            <p>{group.packages.map((p) => `${p.store} #${p.id}`).join(" • ")}</p>
                          </div>
                          <span className="status pending">{group.status}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

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
                            <p>{r.packageIds ? r.packageIds.map((id, index) => `#${id} ${r.packageStores[index]}`).join(" • ") : `Package #${r.packageId}`}</p>
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
                  <button onClick={() => createRequest("Invoice Upload")}><span>📄</span><div><strong>Upload Invoice</strong><p>Upload store or purchase invoice</p></div><b>›</b></button>
                  <button onClick={() => createRequest("Hold / Store Package")}><span>⏸️</span><div><strong>Hold / Store</strong><p>Hold this package in warehouse</p></div><b>›</b></button>
                </div>
              </aside>
            </section>
          </>
        )}

        {activePage === "consolidation" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>Consolidation</h1>
                <p>Select multiple packages to consolidate together.</p>
              </div>
              <button className="primary-btn" onClick={submitConsolidation}>
                Submit Consolidation Request
              </button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header">
                <h2>Select Packages</h2>
                <p>Choose at least 2 packages.</p>
              </div>

              <div className="workflow-body">
                {packages.map((pkg) => (
                  <label key={pkg.id}>
                    <input
                      type="checkbox"
                      checked={selectedForConsolidation.includes(pkg.id)}
                      onChange={() => toggleConsolidationPackage(pkg.id)}
                    />
                    {" "}Package #{pkg.id} - {pkg.store} ({pkg.status})
                  </label>
                ))}

                <textarea placeholder="Special instructions for consolidation..." />
              </div>
            </section>
          </>
        )}

        {activePage === "history" && (
          <>
            <header className="dashboard-header">
              <div><h1>History</h1><p>View completed jobs and past requests.</p></div>
              {completedRequests.length > 0 && <button className="primary-btn" onClick={clearCompletedRequests}>Clear History</button>}
            </header>

            <section className="workflow-card">
              <div className="workflow-header"><h2>Completed Jobs</h2><p>All completed requests will appear here.</p></div>
              <div className="workflow-body">
                {completedRequests.length === 0 && (
                  <div className="task-card"><div><h3>No completed jobs yet</h3><p>When admin marks a request done, it will appear here.</p></div></div>
                )}

                {completedRequests.map((r) => (
                  <div className="task-card" key={r.id}>
                    <div><h3>{r.type}</h3><p>{r.packageIds ? r.packageIds.join(", ") : r.packageId}</p></div>
                    <span className="status success">Completed</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activePage === "dispatch" && <header className="dashboard-header"><div><h1>Dispatch</h1><p>Select packages, choose shipping options, and submit dispatch requests.</p></div></header>}
        {activePage === "invoices" && <header className="dashboard-header"><div><h1>Invoices</h1><p>Upload, review, and manage package invoices.</p></div></header>}
        {activePage === "profile" && <header className="dashboard-header"><div><h1>My Profile</h1><p>Manage your personal information, address, and package labels.</p></div></header>}
        {activePage === "support" && <header className="dashboard-header"><div><h1>Support</h1><p>Get help, submit requests, and track support tickets.</p></div></header>}
      </main>
    </div>
  )
}

export default Dashboard