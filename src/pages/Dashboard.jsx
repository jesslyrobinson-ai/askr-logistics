import { useState } from "react"
import "../App.css"

function Dashboard() {
  const [selectedPackage, setSelectedPackage] = useState("12345")
  const [activeAction, setActiveAction] = useState(null)

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
          <a className="active">Packages</a>
          <a>Consolidation</a>
          <a>Dispatch</a>
          <a>Invoices</a>
          <a>Addresses</a>
          <a>Support</a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>My Packages</h1>
            <p>Manage received packages, consolidation, repacking, and dispatch requests.</p>
          </div>

          <button className="primary-btn">New Request</button>
        </header>

        <section className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon">📦</div>
            <div>
              <h3>2</h3>
              <p>Packages Received</p>
            </div>
          </div>

          <div className="stat-card green">
            <div className="stat-icon">🏬</div>
            <div>
              <h3>1</h3>
              <p>In Storage</p>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">⬇️</div>
            <div>
              <h3>0</h3>
              <p>Ready for Dispatch</p>
            </div>
          </div>

          <div className="stat-card purple">
            <div className="stat-icon">🚚</div>
            <div>
              <h3>3</h3>
              <p>Total Dispatches</p>
            </div>
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
                  <tr>
                    <th>Package</th>
                    <th>Store</th>
                    <th>Status</th>
                    <th>Weight</th>
                    <th>Received</th>
                    <th>Storage</th>
                  </tr>
                </thead>

                <tbody>
                  {packages.map((pkg) => (
                    <tr
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={selectedPackage === pkg.id ? "selected-row" : ""}
                    >
                      <td>#{pkg.id}</td>
                      <td>{pkg.store}</td>
                      <td>
                        <span className={`status-badge ${pkg.status === "Received" ? "received" : "storage"}`}>
                          {pkg.status}
                        </span>
                      </td>
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
                  <div>
                    <h3>Consolidation Options</h3>

                    <label><input type="checkbox" /> Remove unnecessary boxes</label>
                    <label><input type="checkbox" /> Reduce box size</label>
                    <label><input type="checkbox" /> Remove retail packaging</label>
                    <label><input type="checkbox" /> Bubble wrap fragile items</label>
                  </div>

                  <div>
                    <h3>Choose Packages</h3>

                    <select>
                      <option>Select available packages</option>
                      <option>Package #12345 - Amazon</option>
                      <option>Package #67890 - Nike</option>
                    </select>

                    <textarea placeholder="Special instructions for consolidation..."></textarea>

                    <button className="confirm-btn">Submit Request</button>
                  </div>
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
              <div className="mini-images">
                <div>📦</div>
                <div>+2</div>
              </div>
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
                <div>
                  <strong>Request Consolidation</strong>
                  <p>Combine with other packages</p>
                </div>
                <b>›</b>
              </button>

              <button><span>🧊</span><div><strong>Request Repacking</strong><p>Reduce box size / remove packaging</p></div><b>›</b></button>
              <button><span>📝</span><div><strong>Add Instructions</strong><p>Add special notes for this package</p></div><b>›</b></button>
              <button><span>📄</span><div><strong>Upload Invoice</strong><p>Upload store or purchase invoice</p></div><b>›</b></button>
              <button><span>⏸️</span><div><strong>Hold / Store</strong><p>Hold this package in warehouse</p></div><b>›</b></button>
              <button className="dispatch-btn"><span>🚚</span><div><strong>Request Dispatch</strong><p>Ship this package</p></div><b>›</b></button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default Dashboard