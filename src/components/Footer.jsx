import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <h2>🏥 EthioCare</h2>
          <p>
            A modern hospital management system built for Ethiopian
            healthcare providers. Secure, reliable, and easy to use.
          </p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <ul>
            <li><a href="#">📍 Addis Ababa, Ethiopia</a></li>
            <li><a href="#">📞 +251 911 000 000</a></li>
            <li><a href="#">✉️ info@ethiocare.com</a></li>
            <li><a href="#">🌐 www.ethiocare.com</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 EthioCare Hospital Management System. All rights reserved.</p>
        <div className="footer-socials">
          <a href="#" title="Facebook">f</a>
          <a href="#" title="Twitter">t</a>
          <a href="#" title="LinkedIn">in</a>
          <a href="#" title="Instagram">ig</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
