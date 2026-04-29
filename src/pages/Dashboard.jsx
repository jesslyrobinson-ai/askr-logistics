import { useState } from "react"
import "../App.css"

function Dashboard() {
  const [openPanel, setOpenPanel] = useState(null)
  const [selectedAction, setSelectedAction] = useState("")
  const [status, setStatus] = useState({
    "12345": "Received",
    "67890": "In Storage",
  })

  function confirmAction(packageId, newStatus) {
    setStatus({ ...status, [packageId]: newStatus })
    setSelectedAction("")
    setOpenPanel(null)
  }

  function PackageControls({ packageId }) {
    return (
      <div className="control-panel">
        <h4>What would you like to do?</h4>

        <div className="action-options">
          <button onClick={() => setSelectedAction("ship")}>Ship Now</button>
          <button onClick={() => setSelectedAction("hold")}>Hold / Store</button>
          <button onClick={() => setSelectedAction("consolidate")}>Consolidate</button>
          <button onClick={() => setSelectedAction("invoice")}>Upload Invoice</button>
        </div>

        {selectedAction === "ship" && (
          <>
            <select>
              <option>Select Carrier</option>
              <option>DHL</option>
              <option>FedEx</option>
              <option>UPS</option>
              <option>Boat</option>
            </select>

            <select>
              <option>Use Saved Address</option>
              <option>Enter New Address</option>
            </select>

            <div className="instructions">
              <label><input type="checkbox" /> Fragile</label>
              <label><input type="checkbox" /> Remove packaging</label>
            </div>

            <textarea placeholder="Shipping notes..."></textarea>

            <button
              className="confirm-btn"
              onClick={() => confirmAction(packageId, "Ready to Ship")}
            >
              Confirm Action
            </button>
          </>
        )}

        {selectedAction === "hold" && (
          <>
            <p>Package will be held in storage.</p>
            <textarea placeholder="Add storage instructions..."></textarea>

            <button
              className="confirm-btn"
              onClick={() => confirmAction(packageId, "In Storage")}
            >
              Confirm Action
            </button>
          </>
        )}

        {selectedAction === "consolidate" && (
          <>
            <p>Select packages to combine.</p>

            <div className="instructions">
              <label><input type="checkbox" /> Combine with other packages</label>
              <label><input type="checkbox" /> Remove extra packaging</label>
            </div>

            <button
              className="confirm-btn"
              onClick={() => confirmAction(packageId, "Pending Consolidation")}
            >
              Confirm Action
            </button>
          </>
        )}

        {selectedAction === "invoice" && (
          <>
            <input type="file" />
            <p>Upload your invoice for this package.</p>

            <button
              className="confirm-btn"
              onClick={() => confirmAction(packageId, "Invoice Uploaded")}
            >
              Confirm Action
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="app-layout">
      <div className="sidebar">
        <h2>ASKR</h2>
        <p>Dashboard</p>
        <p>Packages</p>
        <p>Shipments</p>
        <p>Invoices</p>
        <p>Addresses</p>
        <p>Settings</p>
      </div>

      <div className="main">
        <div className="topbar">
          <h1>Dashboard</h1>
          <p>Welcome back</p>
        </div>

        <div className="cards">
          <div className="card">
            <h3>2</h3>
            <p>Packages</p>
          </div>

          <div className="card">
            <h3>1</h3>
            <p>In Storage</p>
          </div>

          <div className="card">
            <h3>0</h3>
            <p>Ready to Ship</p>
          </div>
        </div>

        <div className="packages">
          <h2>My Packages</h2>

          <div className="package">
            <h3>Package #12345</h3>
            <p>Status: {status["12345"]}</p>

            <div className="actions">
              <button onClick={() => setOpenPanel(openPanel === "12345" ? null : "12345")}>
                Manage Package
              </button>
            </div>

            {openPanel === "12345" && <PackageControls packageId="12345" />}
          </div>

          <div className="package">
            <h3>Package #67890</h3>
            <p>Status: {status["67890"]}</p>

            <div className="actions">
              <button onClick={() => setOpenPanel(openPanel === "67890" ? null : "67890")}>
                Manage Package
              </button>
            </div>

            {openPanel === "67890" && <PackageControls packageId="67890" />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard