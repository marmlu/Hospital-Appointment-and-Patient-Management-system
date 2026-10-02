import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-badge">⭐ Trusted by 500+ Healthcare Providers</div>
        <h1>
          Modern Healthcare<br />
          <span>Management Made Easy</span>
        </h1>
        <p>
          Manage appointments, patient records, prescriptions, and reports —
          all in one secure platform built for Ethiopian healthcare providers.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">
            👤 Get Started Free
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            🔑 Sign In
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section section-alt">
        <div className="stats-grid">
          <div className="stat-item"><strong>250+</strong><span>Patients Registered</span></div>
          <div className="stat-item"><strong>18</strong><span>Specialist Doctors</span></div>
          <div className="stat-item"><strong>40</strong><span>Appointments Today</span></div>
          <div className="stat-item"><strong>99%</strong><span>Uptime Reliability</span></div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="section" id="services">
        <div className="section-header">
          <span className="badge">Our Services</span>
          <h2>Everything Your Hospital Needs</h2>
          <p>A complete suite of tools to manage your hospital operations efficiently and securely.</p>
        </div>
        <div className="services-grid">
          {[
            { icon: "🗓️", cls: "icon-blue",   title: "Appointment Scheduling", desc: "Book, manage, and track patient appointments with real-time availability." },
            { icon: "📋", cls: "icon-green",  title: "Medical Records",        desc: "Securely store and access complete patient medical histories and treatment plans." },
            { icon: "💊", cls: "icon-purple", title: "Prescription Management",desc: "Issue, track, and manage digital prescriptions with medication history." },
            { icon: "📊", cls: "icon-orange", title: "Reports & Analytics",    desc: "Generate detailed reports on patient activity and hospital statistics." },
            { icon: "🔒", cls: "icon-red",    title: "Secure Authentication",  desc: "Role-based access control keeps patient data safe and private." },
            { icon: "👥", cls: "icon-teal",   title: "Staff Management",       desc: "Manage doctors and staff accounts with department-level permissions." },
          ].map((s) => (
            <div className="service-card" key={s.title}>
              <div className={`icon ${s.cls}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section section-alt" id="about">
        <div className="section-header">
          <span className="badge">About Us</span>
          <h2>Built for Ethiopian Healthcare</h2>
          <p>EthioCare is designed to modernize hospital operations across Ethiopia.</p>
        </div>
        <div className="services-grid" style={{ maxWidth: 700, margin: "0 auto", gridTemplateColumns: "repeat(2,1fr)" }}>
          {[
            { icon: "🌍", cls: "icon-blue",   title: "Local Focus",    desc: "Tailored to meet the unique needs of Ethiopian healthcare providers." },
            { icon: "⚡", cls: "icon-green",  title: "Fast & Reliable",desc: "Optimized for low-bandwidth environments with 99% uptime." },
            { icon: "📱", cls: "icon-purple", title: "Mobile Friendly", desc: "Works seamlessly on any device — desktop, tablet, or smartphone." },
            { icon: "🎓", cls: "icon-orange", title: "Easy to Learn",   desc: "Intuitive interface requiring minimal training for medical staff." },
          ].map((s) => (
            <div className="service-card" key={s.title}>
              <div className={`icon ${s.cls}`}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero" style={{ padding: "70px 40px" }}>
        <h1 style={{ fontSize: 32 }}>Ready to Get Started?</h1>
        <p>Join hundreds of healthcare providers already using EthioCare.</p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">👤 Create Free Account</Link>
          <Link to="/login"    className="btn btn-outline btn-lg">🔑 Login</Link>
        </div>
      </section>
    </>
  );
}

export default Home;
