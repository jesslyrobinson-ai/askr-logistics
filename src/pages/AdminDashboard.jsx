import { useEffect, useState } from "react"
import emailjs from "@emailjs/browser"
import "../App.css"

function AdminDashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState("overview")
  const [requests, setRequests] = useState([])
  const [packageStatuses, setPackageStatuses] = useState({})
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

  const SERVICE_ID = "service_dtkuhqv"
  const TEMPLATE_ID = "template_01d4wxw"
  const PUBLIC_KEY = "FvjojDypw5uHHRweU"

  const loadSharedData = () => {
    setRequests(JSON.parse(localStorage.getItem("requests")) || [])
    setPackageStatuses(JSON.parse(localStorage.getItem("packageStatuses")) || {})
    setExtraPackages(JSON.parse(localStorage.getItem("extraPackages")) || [])
  }

  useEffect(() => {
    loadSharedData()
    window.addEventListener("askrDataUpdated", loadSharedData)

    return () => {
      window.removeEventListener("askrDataUpdated", loadSharedData)
    }
  }, [])

  const notifyDataUpdated = () => {
    window.dispatchEvent(new Event("askrDataUpdated"))
  }

  const sendPackageEmail = async (pkg) => {
    const templateParams = {
      to_email: pkg.email || pkg.customerEmail || "jesslyrobinson@gmail.com",
      customer_name: pkg.customer || "Customer",
      store: pkg.store || "Not provided",
      tracking: pkg.tracking || "Not provided",
      weight: pkg.weight || "Not provided",
      dimensions: pkg.dimensions || "Not provided",
      contents: pkg.contents || "Not provided",
      value: pkg.value || "Not provided",
      location: pkg.location || "Not provided",
      name: "ASKR Logistics",
      email: "askrlogistics@gmail.com",
    }

    return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
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

  const handleReceiveSubmit = async () => {
    if (!receivingPackage) return

    const updatedPackages = extraPackages.map((pkg) =>
      pkg.id === receivingPackage.id
        ? {
            ...pkg,
            status: "Received",
            received: new Date().toLocaleDateString(),
            storageDays: "0 days",
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
    notifyDataUpdated()

    const updatedPkg = updatedPackages.find((p) => p.id === receivingPackage.id)

    try {
      await sendPackageEmail(updatedPkg)
      alert("Package received + real email sent")
    } catch (error) {
      console.error("Email failed:", error)
      alert("Package received, but email failed. Check EmailJS settings.")
    }

    setReceivingPackage(null)
  }

  const incomingPackages = extraPackages.filter(
    (pkg) => (packageStatuses[pkg.id] || pkg.status) === "Incoming"
  )

  const pendingRequests = requests.filter((r) => r.status === "Pending")

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

  const packages = extraPackages.map((pkg) => [
    `PKG-${pkg.id}`,
    pkg.customer || "Customer",
    pkg.store,
    packageStatuses[pkg.id] || pkg.status,
  ])

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
          <h1>Admin Dashboard</h1>
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
          <h1>Incoming Packages</h1>
          <p>Receive packages and send customer arrival emails.</p>

          <section className="card">
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
                {incomingPackages.length === 0 && (
                  <tr><td colSpan="7">No incoming packages yet.</td></tr>
                )}

                {incomingPackages.map((pkg) => {
                  const status = packageStatuses[pkg.id] || pkg.status

                  return (
                    <tr key={pkg.id}>
                      <td>{pkg.customer || "Customer"}</td>
                      <td><strong>PKG-{pkg.id}</strong></td>
                      <td>{pkg.store}</td>
                      <td>{pkg.tracking}</td>
                      <td>{pkg.expectedDate || "Not provided"}</td>
                      <td><span className="status pending">{status}</span></td>
                      <td>
                        <button className="confirm-btn" onClick={() => openReceiveForm(pkg)}>
                          Receive Package
                        </button>
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

              <div className="workflow-body">
                <input placeholder="Weight e.g. 0.2 lbs" value={receiveForm.weight} onChange={(e) => setReceiveForm({ ...receiveForm, weight: e.target.value })} />
                <input placeholder="Dimensions e.g. 10 x 8 x 6 in" value={receiveForm.dimensions} onChange={(e) => setReceiveForm({ ...receiveForm, dimensions: e.target.value })} />
                <input placeholder="Contents e.g. Video Games" value={receiveForm.contents} onChange={(e) => setReceiveForm({ ...receiveForm, contents: e.target.value })} />
                <input placeholder="Quantity e.g. 1 PCS" value={receiveForm.quantity} onChange={(e) => setReceiveForm({ ...receiveForm, quantity: e.target.value })} />
                <input placeholder="Value e.g. 38.35" value={receiveForm.value} onChange={(e) => setReceiveForm({ ...receiveForm, value: e.target.value })} />
                <input placeholder="Shelf Location e.g. A-12-03" value={receiveForm.location} onChange={(e) => setReceiveForm({ ...receiveForm, location: e.target.value })} />
                <textarea placeholder="Condition notes" value={receiveForm.notes} onChange={(e) => setReceiveForm({ ...receiveForm, notes: e.target.value })} />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button className="confirm-btn" onClick={handleReceiveSubmit}>
                    Confirm Receive + Send Email
                  </button>
                  <button className="confirm-btn" onClick={() => setReceivingPackage(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}
        </main>
      )}

      {activePage === "customers" && (
        <main className="main-content">
          <h1>Customers</h1>
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
          <h1>Packages</h1>
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
          <h1>Dispatch</h1>
          <p>Manage ready shipments and carrier assignments.</p>
        </main>
      )}
    </div>
  )
}

export default AdminDashboard