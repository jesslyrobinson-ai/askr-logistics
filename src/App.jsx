import "./App.css"
import logo from "./assets/logo.png.png"

function App() {
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
        <button>Get Started</button>
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

export default App