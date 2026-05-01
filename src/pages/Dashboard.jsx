import { useState } from "react"
import "../App.css"

function Dashboard() {
  const [selectedPackage, setSelectedPackage] = useState("12345")
  const [activeAction, setActiveAction] = useState(null)
  const [activePage, setActivePage] = useState("packages")

  const packages = [
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

  const currentPackage = packages.find((pkg) => pkg.id === selectedPackage)

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

        <nav>
          <a className={activePage === "packages" ? "active" : ""} onClick={() => setActivePage("packages")}>Packages</a>
          <a>Consolidation</a>
          <a className={activePage === "dispatch" ? "active" : ""} onClick={() => setActivePage("dispatch")}>Dispatch</a>
          <a>Invoices</a>
          <a className={activePage === "profile" ? "active" : ""} onClick={() => setActivePage("profile")}>My Profile</a>
          <a>Support</a>
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
              <button className="primary-btn">New Request</button>
            </header>

            <section className="stats-grid">
              <div className="stat-card blue"><div className="stat-icon">📦</div><div><h3>2</h3><p>Packages Received</p></div></div>
              <div className="stat-card green"><div className="stat-icon">🏬</div><div><h3>1</h3><p>In Storage</p></div></div>
              <div className="stat-card orange"><div className="stat-icon">⬇️</div><div><h3>0</h3><p>Ready for Dispatch</p></div></div>
              <div className="stat-card purple"><div className="stat-icon">🚚</div><div><h3>3</h3><p>Total Dispatches</p></div></div>
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
                      <tr>
                        <th>Package</th><th>Store</th><th>Status</th><th>Weight</th><th>Received</th><th>Storage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((pkg) => (
                        <tr key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={selectedPackage === pkg.id ? "selected-row" : ""}>
                          <td>#{pkg.id}</td>
                          <td>{pkg.store}</td>
                          <td><span className={`status-badge ${pkg.status === "Received" ? "received" : "storage"}`}>{pkg.status}</span></td>
                          <td>{pkg.weight}</td>
                          <td>{pkg.received}</td>
                          <td>{pkg.storageDays}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeAction === "consolidation" && (
                  <section className="workflow-card">
                    <div className="workflow-header">
                      <h2>Request Consolidation</h2>
                      <p>Select packaging options and choose which packages to consolidate.</p>
                    </div>
                    <div className="workflow-body">
                      <h3>Consolidation Options</h3>
                      <label><input type="checkbox" /> Remove unnecessary boxes</label>
                      <label><input type="checkbox" /> Reduce box size</label>
                      <label><input type="checkbox" /> Remove retail packaging</label>
                      <label><input type="checkbox" /> Bubble wrap fragile items</label>

                      <h3>Choose Packages</h3>
                      <select>
                        <option>Select available packages</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id}>Package #{pkg.id} - {pkg.store}</option>
                        ))}
                      </select>

                      <textarea placeholder="Special instructions for consolidation..."></textarea>
                      <button className="confirm-btn">Submit Request</button>
                    </div>
                  </section>
                )}

                {activeAction === "invoice" && (
                  <section className="workflow-card">
                    <div className="workflow-header">
                      <h2>Upload Invoice</h2>
                      <p>Upload the store invoice or receipt for Package #{currentPackage.id}.</p>
                    </div>
                    <div className="workflow-body">
                      <h3>Invoice Upload</h3>
                      <p>Selected package: <strong>#{currentPackage.id} - {currentPackage.store}</strong></p>
                      <label>Select invoice file<input type="file" /></label>
                      <textarea placeholder="Add any invoice notes..."></textarea>
                      <button className="confirm-btn">Submit Invoice</button>
                    </div>
                  </section>
                )}

                {activeAction === "hold" && (
                  <section className="workflow-card">
                    <div className="workflow-header">
                      <h2>Hold / Store Package</h2>
                      <p>Choose storage options for Package #{currentPackage.id}.</p>
                    </div>
                    <div className="workflow-body">
                      <h3>Storage Request</h3>
                      <p>Selected package: <strong>#{currentPackage.id} - {currentPackage.store}</strong></p>

                      <select>
                        <option>Select hold reason</option>
                        <option>For consolidation</option>
                        <option>Do not consolidate</option>
                      </select>

                      <select>
                        <option>Select storage duration</option>
                        <option>2 days</option>
                        <option>3 days</option>
                        <option>4 days</option>
                        <option>5 days</option>
                      </select>

                      <textarea placeholder="Special storage instructions..."></textarea>
                      <button className="confirm-btn">Confirm Hold Request</button>
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
                  <div className="detail-row"><span>Weight</span><strong>{currentPackage.weight}</strong></div>
                  <div className="detail-row"><span>Dimensions</span><strong>{currentPackage.dimensions}</strong></div>
                  <div className="detail-row"><span>Received</span><strong>{currentPackage.received}</strong></div>
                  <div className="detail-row"><span>Storage Days</span><strong>{currentPackage.storageDays}</strong></div>
                  <div className="detail-row"><span>Location</span><strong>{currentPackage.location}</strong></div>
                </div>

                <div className="actions-section">
                  <h4>Actions</h4>

                  <button onClick={() => setActiveAction("consolidation")}>
                    <span>📦</span>
                    <div><strong>Request Consolidation</strong><p>Combine with other packages</p></div>
                    <b>›</b>
                  </button>

                  <button onClick={() => setActiveAction("invoice")}>
                    <span>📄</span>
                    <div><strong>Upload Invoice</strong><p>Upload store or purchase invoice</p></div>
                    <b>›</b>
                  </button>

                  <button onClick={() => setActiveAction("hold")}>
                    <span>⏸️</span>
                    <div><strong>Hold / Store</strong><p>Hold this package in warehouse</p></div>
                    <b>›</b>
                  </button>
                </div>
              </aside>
            </section>
          </>
        )}

        {activePage === "dispatch" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>Dispatch</h1>
                <p>Select packages, choose shipping options, and submit a dispatch request.</p>
              </div>
              <button className="primary-btn">New Dispatch</button>
            </header>

            <section className="workflow-card">
              <div className="workflow-header">
                <h2>Request Dispatch</h2>
                <p>Choose which packages you want shipped.</p>
              </div>

              <div className="workflow-body">
                <h3>Select Packages</h3>
                {packages.map((pkg) => (
                  <label key={pkg.id}>
                    <input type="checkbox" /> Package #{pkg.id} - {pkg.store} ({pkg.weight})
                  </label>
                ))}

                <h3>Shipping Carrier</h3>
                <select>
                  <option>Select carrier</option>
                  <option>DHL</option>
                  <option>FedEx</option>
                  <option>UPS</option>
                </select>

                <h3>Shipping Speed</h3>
                <select>
                  <option>Select shipping speed</option>
                  <option>Standard</option>
                  <option>Express</option>
                  <option>Priority</option>
                </select>

                <textarea placeholder="Delivery instructions or special notes..."></textarea>
                <button className="confirm-btn">Submit Dispatch Request</button>
              </div>
            </section>
          </>
        )}

        {activePage === "profile" && (
          <>
            <header className="dashboard-header">
              <div>
                <h1>My Profile</h1>
                <p>Manage your personal information, address, and package labels.</p>
              </div>
              <button className="primary-btn">New Request</button>
            </header>

            <section>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="packages-card">
                  <div className="section-title">
                    <h2>👤 Profile Information</h2>
                  </div>

                  <div className="detail-section">
                    <div className="main-package-img" style={{ marginBottom: "20px" }}>👤</div>
                    <div className="detail-row"><span>Name</span><strong>Jessly Robinson</strong></div>
                    <div className="detail-row"><span>Email</span><strong>example@email.com</strong></div>
                    <div className="detail-row"><span>Phone</span><strong>123-456-7890</strong></div>
                  </div>
                </div>

                <div className="packages-card">
                  <div className="section-title">
                    <h2>📍 My Address</h2>
                  </div>

                  <div className="detail-section">
                    <div className="main-package-img" style={{ marginBottom: "20px" }}>🏠</div>
                    <div className="detail-row"><span>Street</span><strong>123 Main St</strong></div>
                    <div className="detail-row"><span>City</span><strong>Miami</strong></div>
                    <div className="detail-row"><span>Country</span><strong>USA</strong></div>
                    <div className="detail-row"><span>Phone</span><strong>123-456-7890</strong></div>
                  </div>

                  <button className="primary-btn">Edit Address</button>
                </div>
              </div>

              <div className="packages-card" style={{ marginTop: "20px" }}>
                <div className="section-title">
                  <h2>🏷️ Rename Your Packages</h2>
                  <p>Add custom names so you can recognize your packages faster.</p>
                </div>

                <div className="workflow-body">
                  {packages.map((pkg) => (
                    <label key={pkg.id}>
                      📦 Package #{pkg.id} - {pkg.store}
                      <input placeholder={`Rename Package #${pkg.id}`} />
                    </label>
                  ))}

                  <button className="confirm-btn">Save Package Names</button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard