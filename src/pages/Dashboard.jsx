import { useEffect, useState } from "react"
import "../App.css"
import { listenToPackages, addPackageToFirebase } from "../packageService"

function Dashboard({ user, onLogout }) {
  const [selectedPackage, setSelectedPackage] = useState("12345")
  const [activePage, setActivePage] = useState("packages")
  const [requests, setRequests] = useState([])
  const [extraPackages, setExtraPackages] = useState([])
  const [selectedForConsolidation, setSelectedForConsolidation] = useState([])
  const [incomingForm, setIncomingForm] = useState({
    store: "",
    tracking: "",
    expectedDate: "",
  })

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || [])

    const unsubscribe = listenToPackages((data) => {
      setExtraPackages(data)
    })

    return () => unsubscribe()
  }, [])

  const basePackages = [
    {
      id: "12345",
      store: "Amazon",
      tracking: "1Z999AA10123456784",
      status: "In Storage",
      weight: "3.2 lbs",
      dimensions: "12 x 10 x 8 in",
      received: "May 20, 2025",
      storageStartDate: "2025-05-20",
      storageDays: "13 days",
      location: "A-12-03",
      expectedDate: "May 20, 2025",
    },
    {
      id: "67890",
      store: "Nike",
      tracking: "9400111206213890000000",
      status: "In Storage",
      weight: "5.1 lbs",
      dimensions: "16 x 12 x 10 in",
      received: "May 19, 2025",
      storageStartDate: "2025-05-19",
      storageDays: "12 days",
      location: "B-08-11",
      expectedDate: "May 19, 2025",
    },
  ]

  const getStorageDays = (pkg) => {
    if (!pkg.storageStartDate) return pkg.storageDays || "0 days"

    const start = new Date(pkg.storageStartDate)
    const today = new Date()
    const diffTime = today - start
    const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)))

    return `${diffDays} day${diffDays === 1 ? "" : "s"}`
  }

  const packages = [...basePackages, ...extraPackages].map((pkg) => ({
    ...pkg,
    storageDays: pkg.status === "In Storage" ? getStorageDays(pkg) : pkg.storageDays,
  }))

  const currentPackage = packages.find((pkg) => pkg.id === selectedPackage) || packages[0]

  const activeRequests = requests.filter((r) => r.status !== "Completed")
  const completedRequests = requests.filter((r) => r.status === "Completed")
  const consolidationGroups = JSON.parse(localStorage.getItem("consolidationGroups")) || []

  const incomingCount = packages.filter((p) => p.status === "Incoming").length
  const storageCount = packages.filter((p) => p.status.includes("Storage") || p.status === "In Storage").length
  const readyCount = packages.filter((p) => p.status === "Ready for Dispatch").length
  const storagePendingCount = packages.filter((p) => p.status === "Storage Pending").length
  const consolidatedStorageCount = packages.filter((p) => p.status === "Consolidated - In Storage").length

  const addIncomingPackage = async () => {
    if (!incomingForm.store || !incomingForm.tracking) {
      alert("Add store name and tracking number")
      return
    }

    const newPackage = {
      id: String(Date.now()).slice(-5),
      store: incomingForm.store,
      tracking: incomingForm.tracking,
      customer: user?.name || "Customer",
      email: user?.email || "customer@email.com",
      status: "Incoming",
      weight: "Pending",
      dimensions: "Pending",
      received: "Not received yet",
      storageStartDate: "",
      storageDays: "0 days",
      location: "Awaiting arrival",
      expectedDate: incomingForm.expectedDate || "Not provided",
    }

    await addPackageToFirebase(newPackage)
    setSelectedPackage(newPackage.id)
    setIncomingForm({ store: "", tracking: "", expectedDate: "" })
  }

  const simulateIncomingPackage = async () => {
    const newPackage = {
      id: String(Date.now()).slice(-5),
      store: ["Shein", "Zara", "Amazon", "Nike"][Math.floor(Math.random() * 4)],
      tracking: "SIM-" + Date.now(),
      customer: user?.name || "Customer",
      email: user?.email || "customer@email.com",
      status: "Incoming",
      weight: "Pending",
      dimensions: "Pending",
      received: "Not received yet",
      storageStartDate: "",
      storageDays: "0 days",
      location: "Awaiting arrival",
      expectedDate: new Date().toLocaleDateString(),
    }

    await addPackageToFirebase(newPackage)
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

    const updatedRequests = [newRequest, ...saved]
    localStorage.setItem("requests", JSON.stringify(updatedRequests))
    setRequests(updatedRequests)
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

  const getJourneyStep = (status) => {
    if (status === "Incoming") return 1
    if (status.includes("Storage") || status === "In Storage") return 2
    if (status.includes("Consolidated")) return 3
    if (status === "Ready for Dispatch") return 4
    if (status.includes("Dispatch") || status === "Out for Delivery") return 5
    return 1
  }

  const journeyStep = getJourneyStep(currentPackage?.status || "Incoming")

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
          <a className={activePage === "storage" ? "active" : ""} onClick={() => setActivePage("storage")}>My Storage</a>
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
                <p>Track packages from incoming shipment to storage, consolidation, and dispatch.</p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button className="primary-btn" onClick={() => createRequest("General Package Request")}>New Request</button>
                <button className="primary-btn" onClick={simulateIncomingPackage}>+ Sim Incoming</button>
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card blue"><div className="stat-icon">🛬</div><div><h3>{incomingCount}</h3><p>Incoming</p></div></div>
              <div className="stat-card orange"><div className="stat-icon">🏬</div><div><h3>{storageCount}</h3><p>In Storage</p></div></div>
              <div className="stat-card purple"><div className="stat-icon">🚚</div><div><h3>{readyCount}</h3><p>Ready Dispatch</p></div></div>
            </section>

            <section className="workflow-card" style={{ marginBottom: "24px" }}>
              <div className="workflow-header">
                <h2>Package Journey Tracker</h2>
                <p>Currently tracking: <strong>#{currentPackage.id} - {currentPackage.store}</strong></p>
              </div>

              <div className="workflow-body">
                <div className="task-card">
                  <div>
                    <h3>{currentPackage.store}</h3>
                    <p>Tracking: {currentPackage.tracking}</p>
                    <p>Status: {currentPackage.status}</p>
                  </div>
                  <span className="status pending">{currentPackage.status}</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px", marginTop: "14px" }}>
                  {["Incoming", "Storage", "Consolidated", "Ready", "Dispatched"].map((step, index) => (
                    <div
                      key={step}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        textAlign: "center",
                        fontWeight: "700",
                        background: journeyStep >= index + 1 ? "#dcfce7" : "#f1f5f9",
                        color: journeyStep >= index + 1 ? "#166534" : "#64748b",
                      }}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="workflow-card" style={{ marginBottom: "24px" }}>
              <div className="workflow-header">
                <h2>Add Incoming Package</h2>
                <p>Use this when you send items to your ASKR address.</p>
              </div>

              <div className="workflow-body">
                <input
                  placeholder="Store name e.g. Amazon, Nike, Shein"
                  value={incomingForm.store}
                  onChange={(e) => setIncomingForm({ ...incomingForm, store: e.target.value })}
                />

                <input
                  placeholder="Tracking number"
                  value={incomingForm.tracking}
                  onChange={(e) => setIncomingForm({ ...incomingForm, tracking: e.target.value })}
                />

                <input
                  type="date"
                  value={incomingForm.expectedDate}
                  onChange={(e) => setIncomingForm({ ...incomingForm, expectedDate: e.target.value })}
                />

                <button className="confirm-btn" onClick={addIncomingPackage}>
                  Add Incoming Package
                </button>
              </div>
            </section>

            <section className="workflow-card" style={{ marginBottom: "24px" }}>
              <div className="workflow-header">
                <h2>Action Center</h2>
                <p>Actions apply to selected package: <strong>#{currentPackage.id} - {currentPackage.store}</strong></p>
              </div>

              <div className="actions-section" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                <button onClick={() => setActivePage("consolidation")}><span>📦</span><div><strong>Request Consolidation</strong><p>Combine with other packages</p></div><b>›</b></button>
                <button onClick={() => createRequest("Invoice Upload")}><span>📄</span><div><strong>Upload Invoice</strong><p>Upload store or purchase invoice</p></div><b>›</b></button>
                <button onClick={() => createRequest("Hold / Store Package")}><span>⏸️</span><div><strong>Hold / Store</strong><p>Hold this package in warehouse</p></div><b>›</b></button>
              </div>
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
                      <tr><th>Package</th><th>Store</th><th>Status</th><th>Tracking</th><th>Expected</th><th>Storage</th></tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.firebaseId || pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={selectedPackage === pkg.id ? "selected-row" : ""}>
                          <td>#{pkg.id}</td>
                          <td>{pkg.store}</td>
                          <td><span className="status-badge storage">{pkg.status}</span></td>
                          <td>{pkg.tracking}</td>
                          <td>{pkg.expectedDate || pkg.received}</td>
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
                  <div className="detail-row"><span>Expected</span><strong>{currentPackage.expectedDate}</strong></div>
                  <div className="detail-row"><span>Received</span><strong>{currentPackage.received}</strong></div>
                  <div className="detail-row"><span>Storage Started</span><strong>{currentPackage.storageStartDate || "Not started"}</strong></div>
                  <div className="detail-row"><span>Storage Days</span><strong>{currentPackage.storageDays}</strong></div>
                  <div className="detail-row"><span>Location</span><strong>{currentPackage.location}</strong></div>
                </div>
              </aside>
            </section>
          </>
        )}

        {activePage === "storage" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>My Storage</h1>
                <p>Manage stored packages, consolidated packages, and storage requests.</p>
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card green"><div className="stat-icon">🏬</div><div><h3>{storageCount}</h3><p>In Storage</p></div></div>
              <div className="stat-card orange"><div className="stat-icon">⏳</div><div><h3>{storagePendingCount}</h3><p>Storage Pending</p></div></div>
              <div className="stat-card blue"><div className="stat-icon">📦</div><div><h3>{consolidatedStorageCount}</h3><p>Consolidated - In Storage</p></div></div>
              <div className="stat-card purple"><div className="stat-icon">⚠️</div><div><h3>0</h3><p>Storage Expiring</p></div></div>
            </section>

            {consolidationGroups.length > 0 && (
              <section className="workflow-card">
                <div className="workflow-header">
                  <h2>Consolidated Storage Groups</h2>
                  <p>Each group shows the individual packages consolidated together.</p>
                </div>

                <div className="workflow-body">
                  {consolidationGroups.map((group) => (
                    <div className="task-card" key={group.id}>
                      <div>
                        <h3>{group.id}</h3>
                        <p>{group.packages.map((p) => `${p.store} #${p.id}`).join(" • ")}</p>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span className="status pending">{group.status}</span>
                        <button className="confirm-btn" onClick={() => createRequest("Dispatch Request", group.packages)}>Request Dispatch</button>
                        <button className="confirm-btn" onClick={() => createRequest("Extend Storage", group.packages)}>Extend Storage</button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="workflow-card">
              <div className="workflow-header">
                <h2>Stored Packages</h2>
                <p>All individual packages currently in storage.</p>
              </div>

              <div className="workflow-body">
                {packages
                  .filter((pkg) => pkg.status.includes("Storage") || pkg.status === "In Storage")
                  .map((pkg) => (
                    <div className="task-card" key={pkg.firebaseId || pkg.id}>
                      <div>
                        <h3>#{pkg.id} - {pkg.store}</h3>
                        <p>{pkg.status} • {pkg.weight} • {pkg.storageDays}</p>
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        <button className="confirm-btn" onClick={() => createRequest("Dispatch Request", [pkg])}>Request Dispatch</button>
                        <button className="confirm-btn" onClick={() => createRequest("Extend Storage", [pkg])}>Extend Storage</button>
                        <button className="confirm-btn" onClick={() => setActivePage("consolidation")}>Request Consolidation</button>
                      </div>
                    </div>
                  ))}
              </div>
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
                  <label key={pkg.firebaseId || pkg.id}>
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