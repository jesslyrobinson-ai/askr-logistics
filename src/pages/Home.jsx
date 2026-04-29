import { Link } from "react-router-dom"
import "../App.css"
import logo from "../assets/logo.png.png"

function Home() {
  return (
    <div className="page">
      <nav className="navbar">
        <img src={logo} alt="ASKR Logistics" />
        <button>Get a Quote</button>
      </nav>

      <section className="hero">
        <h1>Package Receiving & Consolidation Made Simple</h1>
        <p>
          We help businesses receive, organize, and consolidate packages before
          final shipping through DHL, FedEx, or UPS.
        </p>
        <Link to="/dashboard">
  <button>Go to Dashboard</button>
</Link>
      </section>
      <section className="how">
  <h2>How It Works</h2>

  <div className="how-grid">
    <div>
      <h3>1. Send Packages</h3>
      <p>Ship items from your suppliers to our warehouse.</p>
    </div>

    <div>
      <h3>2. We Receive & Organize</h3>
      <p>We log, track, and store your packages safely.</p>
    </div>

    <div>
      <h3>3. Consolidate</h3>
      <p>We combine your shipments into one package to save cost.</p>
    </div>

    <div>
      <h3>4. Ship Out</h3>
      <p>We prepare and send via DHL, FedEx, or UPS.</p>
    </div>
  </div>
</section>
      <section className="services">
  <h2>What We Do</h2>

  <div className="services-grid">
    <div>
      <h3>Package Receiving</h3>
      <p>We receive packages from all your suppliers at our location.</p>
    </div>

    <div>
      <h3>Organization</h3>
      <p>We track and manage your incoming shipments so nothing gets lost.</p>
    </div>

    <div>
      <h3>Consolidation</h3>
      <p>We combine multiple packages into one to save you time and cost.</p>
    </div>

    <div>
      <h3>Shipping Prep</h3>
      <p>We prepare your packages for DHL, FedEx, or UPS delivery.</p>
    </div>
  </div>
</section>
    </div>
  )
}

export default Home