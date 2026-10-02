import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ForgotPassword() {
  const navigate  = useNavigate();
  const [email, setEmail]   = useState("");
  const [error, setError]   = useState("");
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    if (!email.trim()) { setError("Email address is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Please enter a valid email address."); return; }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setAlert({ type: "success", msg: "Reset link sent! Check your inbox. Redirecting to reset page…" });
    setTimeout(() => navigate("/reset-password"), 2000);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">🔐</div>
          <span>EthioCare</span>
        </div>

        <div className="auth-header">
          <h2>Forgot Password?</h2>
          <p>Enter your email and we'll send you instructions to reset your password.</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span className="alert-icon">✅</span>
            <span>{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <div className="form-group">
            <label htmlFor="forgotEmail">📧 Email Address</label>
            <input
              id="forgotEmail" type="email" placeholder="john@gmail.com"
              className={error ? "error" : ""}
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              autoComplete="email" disabled={loading}
            />
            {error && <span className="field-error">{error}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? "Sending…" : "📨 Send Reset Link"}
          </button>

          <Link to="/login" className="btn btn-secondary btn-full">
            ← Back to Login
          </Link>

        </form>

        <p className="auth-footer" style={{ marginTop: 18 }}>
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
