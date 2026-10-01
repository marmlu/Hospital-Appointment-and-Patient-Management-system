import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, onLogout }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate  = useNavigate();

  const isActive = (path) => location.pathname === path;

  function handleLogout() {
    if (onLogout) onLogout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">🏥</div>
        <div>
          <h1>EthioCare</h1>
          <span>Hospital Management</span>
        </div>
      </div>

      {/* Hamburger */}
      <button
        className="navbar-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Links */}
      <ul className={`navbar-links${open ? " open" : ""}`}>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`btn-login${isActive("/login") ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`btn-register${isActive("/register") ? " active" : ""}`}
                onClick={() => setOpen(false)}
              >
                Register
              </Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""} onClick={() => setOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={isActive("/profile") ? "active" : ""}
                onClick={() => setOpen(false)}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                className="btn-login"
                onClick={() => { setOpen(false); handleLogout(); }}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
