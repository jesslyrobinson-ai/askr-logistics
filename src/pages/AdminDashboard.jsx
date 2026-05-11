import { useEffect, useState } from "react"
import "../App.css"

function AdminDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview")
  const [requests, setRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [requestFilter, setRequestFilter] = useState("All")
  const [packageStatuses, setPackageStatuses] = useState({})
  const [consolidationGroups, setConsolidationGroups] = useState([])
  const [extraPackages, setExtraPackages] = useState([])
  const [receivingPackage, setReceivingPackage] = useState(null)

  const [receiveForm, setReceiveForm] = useState({
    weight: "",
    dimensions: "",
    contents: "",
    quantity: "",
    value: "",
    location: "",
    notes: "",
  })

  useEffect(() => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || [])
    setPackageStatuses(JSON.parse(localStorage.getItem("packageStatuses")) || {})
    setConsolidationGroups(JSON.parse(localStorage.getItem("consolidationGroups")) || [])
    setExtraPackages(JSON.parse(localStorage.getItem("extraPackages")) || [])
  }, [])

  const getPackagesFromRequest = (request) => {
    if (request?.packageIds?.length) {
      return request.packageIds.map((id, index) => ({
        id,
        store: request.packageStores?.[index] || "Unknown",
      }))
    }
    return [{ id: request?.packageId, store: request?.packageStore }]
  }

  const getNewPackageStatus = (type) => {
    if (type.includes("Consolidation")) return "Consolidated - In Storage"
    if (type.includes("Invoice")) return "Invoice Uploaded"
    if (type.includes("Dispatch")) return "Out for Delivery"
    if (type.includes("Hold")) return "In Storage"
    if (type.includes("Extend Storage")) return "In Storage"
    return "Completed"
  }

  // 🔥 EMAIL FUNCTION (NEW)
  const sendPackageEmail = (pkg) => {
    const emailData = {
      to: pkg.customerEmail || "customer@email.com",
      subject: "Package Received at ASKR Warehouse",
      body: `
Hello ${pkg.customer || "Customer"},

We received your package.

From: ${pkg.store}
Tracking#: ${pkg.tracking}
Weight: ${pkg.weight}
Dimensions: ${pkg.dimensions}
Contents: ${pkg.contents}
Value: ${pkg.value}

Status: Received at ASKR Warehouse

- ASKR Logistics
      `,
    }

    console.log("EMAIL SENT:", emailData)
  }

  const openReceiveForm = (pkg) => {
    setReceivingPackage(pkg)
    setReceiveForm({
      weight: "",
      dimensions: "",
      contents: "",
      quantity: "",
      value: "",
      location: "",
      notes: "",
    })
  }

  const handleReceiveSubmit = () => {
    if (!receivingPackage) return

    const updatedPackages = extraPackages.map((pkg) =>
      pkg.id === receivingPackage.id
        ? {
            ...pkg,
            status: "Received",
            received: new Date().toLocaleDateString(),
            ...receiveForm,
          }
        : pkg
    )

    const updatedStatuses = {
      ...packageStatuses,
      [receivingPackage.id]: "Received",
    }

    localStorage.setItem("extraPackages", JSON.stringify(updatedPackages))
    localStorage.setItem("packageStatuses", JSON.stringify(updatedStatuses))

    setExtraPackages(updatedPackages)
    setPackageStatuses(updatedStatuses)

    const updatedPkg = updatedPackages.find(p => p.id === receivingPackage.id)

    // 🔥 TRIGGER EMAIL HERE
    sendPackageEmail(updatedPkg)

    setReceivingPackage(null)

    alert("Package received + email triggered")
  }

  const updateRequestStatus = (id, status) => {
    const requestToUpdate = requests.find((r) => r.id === id)
    const requestPackages = getPackagesFromRequest(requestToUpdate)

    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status } : request
    )

    const updatedPackageStatuses = { ...packageStatuses }

    requestPackages.forEach((pkg) => {
      if (pkg.id) updatedPackageStatuses[pkg.id] = getNewPackageStatus(requestToUpdate.type)
    })

    setRequests(updatedRequests)
    setPackageStatuses(updatedPackageStatuses)

    localStorage.setItem("requests", JSON.stringify(updatedRequests))
    localStorage.setItem("packageStatuses", JSON.stringify(updatedPackageStatuses))
  }

  const incomingPackages = extraPackages.filter(
    (pkg) => (packageStatuses[pkg.id] || pkg.status) === "Incoming"
  )

  const pendingRequests = requests.filter((r) => r.status === "Pending")
    const filteredRequests =
    requestFilter === "All"
      ? requests
      : requests.filter((request) => request.status === requestFilter)

  const queueCards = [
    { title: "Incoming Packages", count: incomingPackages.length, icon: "🛬" },
    { title: "Orders to Ship", count: 3, icon: "🚚" },
    { title: "Late Orders", count: 3, icon: "⏰" },
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

  const basePackages = [
    ["PKG-12345", "Jessly Robinson", "Amazon", packageStatuses["12345"] || "Missing Invoice"],
    ["PKG-67890", "Jessly Robinson", "Nike", packageStatuses["67890"] || "In Storage"],
    ["PKG-55219", "Robert Parker", "Apple", "Ready for Dispatch"],
    ["PKG-33091", "Lisa Thompson", "Shein", "New Arrival"],
  ]

  const packages = [
    ...basePackages,
    ...extraPackages.map((pkg) => [
      `PKG-${pkg.id}`,
      pkg.customer || "Customer",
      pkg.store,
      packageStatuses[pkg.id] || pkg.status,
    ]),
  ]

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📦</div>
          <div><h2>ASKR</h2><p>Logistics</p></div>
        </div>

        <p style={{ marginTop: "20px", fontWeight: "600" }}>Admin: {user?.name}</p>
        <button onClick={onLogout} className="confirm-btn">Logout</button>

        <nav>
          <button className={activePage === "overview" ? "active" : ""} onClick={() => setActivePage("overview")}>Overview</button>
          <button className={activePage === "incoming" ? "active" : ""} onClick={() => setActivePage("incoming")}>Incoming</button>
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
        </main>
      )}

      {activePage === "incoming" && (
        <main className="main-content">
          <div className="topbar">
            <div>
              <h1>Incoming Packages</h1>
              <p>Receive packages and trigger customer arrival emails.</p>
            </div>
          </div>

          <section className="card">
            <div className="topbar">
              <h2>Master Incoming Tracker</h2>
              <input className="search-input" placeholder="Search tracking number..." />
            </div>

            <table className="customer-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Package</th>
                  <th>Store</th>
                  <th>Tracking</th>
                  <th>ETA</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {extraPackages.length === 0 && (
                  <tr><td colSpan="7">No incoming packages yet.</td></tr>
                )}

                {extraPackages.map((pkg) => {
                  const status = packageStatuses[pkg.id] || pkg.status

                  return (
                    <tr key={pkg.id}>
                      <td>{pkg.customer || "Customer"}</td>
                      <td><strong>PKG-{pkg.id}</strong></td>
                      <td>{pkg.store}</td>
                      <td>{pkg.tracking}</td>
                      <td>{pkg.expectedDate || "Not provided"}</td>
                      <td><span className={status === "Received" ? "status success" : "status pending"}>{status}</span></td>
                      <td>
                        {status === "Incoming" ? (
                          <button className="confirm-btn" onClick={() => openReceiveForm(pkg)}>
                            Receive Package
                          </button>
                        ) : (
                          <button className="confirm-btn" disabled>Received</button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>

          {receivingPackage && (
            <section className="card" style={{ marginTop: "24px" }}>
              <h2>Receive Package: PKG-{receivingPackage.id}</h2>
              <p>{receivingPackage.customer || "Customer"} • {receivingPackage.store} • {receivingPackage.tracking}</p>

              <div className="workflow-body">
                <input placeholder="Weight e.g. 0.2 lbs" value={receiveForm.weight} onChange={(e) => setReceiveForm({ ...receiveForm, weight: e.target.value })} />
                <input placeholder="Dimensions e.g. 10 x 8 x 6 in" value={receiveForm.dimensions} onChange={(e) => setReceiveForm({ ...receiveForm, dimensions: e.target.value })} />
                <input placeholder="Contents e.g. Video Games" value={receiveForm.contents} onChange={(e) => setReceiveForm({ ...receiveForm, contents: e.target.value })} />
                <input placeholder="Quantity e.g. 1 PCS" value={receiveForm.quantity} onChange={(e) => setReceiveForm({ ...receiveForm, quantity: e.target.value })} />
                <input placeholder="Value e.g. 38.35" value={receiveForm.value} onChange={(e) => setReceiveForm({ ...receiveForm, value: e.target.value })} />
                <input placeholder="Shelf Location e.g. A-12-03" value={receiveForm.location} onChange={(e) => setReceiveForm({ ...receiveForm, location: e.target.value })} />
                <textarea placeholder="Condition notes" value={receiveForm.notes} onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })} />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="confirm-btn" onClick={handleReceiveSubmit}>Confirm Receive + Email</button>
                  <button className="confirm-btn" onClick={() => setReceivingPackage(null)}>Cancel</button>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {activePage === "customers" && (
        <main className="main-content">
          <div className="topbar">
            <div><h1>Customers</h1><p>Manage customers and activity.</p></div>
          </div>

          <section className="card">
            <table className="customer-table">
              <thead><tr><th>Name</th><th>Email</th><th>Packages</th><th>Status</th><th>Action</th></tr></thead>
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
            <div><h1>Packages</h1><p>Track package flow from arrival to dispatch.</p></div>
          </div>

          <section className="card">
            <table className="customer-table">
              <thead><tr><th>Package ID</th><th>Customer</th><th>Store</th><th>Status</th><th>Action</th></tr></thead>
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
            <div><h1>Dispatch</h1><p>Manage ready shipments and carrier assignments.</p></div>
          </div>
        </main>
      )}
    </div>
  )
}

export default AdminDashboard