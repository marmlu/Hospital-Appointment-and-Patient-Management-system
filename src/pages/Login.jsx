import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DEMO_EMAIL    = "john@gmail.com";
const DEMO_PASSWORD = "password123";

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ email: "", password: "", remember: false });
  const [errors, setErrors] = useState({});
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  function validate() {
    const e = {};
    if (!form.email)                       e.email    = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.password)                    e.password = "Password is required.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);

    if (form.email === DEMO_EMAIL && form.password === DEMO_PASSWORD) {
      setAlert({ type: "success", msg: "Login successful! Redirecting…" });
      setTimeout(() => { onLogin && onLogin(); navigate("/profile"); }, 1000);
    } else {
      setAlert({ type: "error", msg: "Invalid email or password. Try john@gmail.com / password123" });
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">🏥</div>
          <span>EthioCare</span>
        </div>

        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to your EthioCare account to continue.</p>
        </div>

        {/* Demo hint */}
        <div className="alert alert-info" style={{ marginBottom: 18 }}>
          <span className="alert-icon">ℹ️</span>
          <span>Demo: <strong>john@gmail.com</strong> / <strong>password123</strong></span>
        </div>

        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span className="alert-icon">{alert.type === "error" ? "⚠️" : "✅"}</span>
            <span>{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="loginEmail">📧 Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="john@gmail.com"
              className={errors.email ? "error" : ""}
              value={form.email}
              onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: "" })); }}
              autoComplete="email"
              disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="loginPassword">🔒 Password</label>
            <div className="input-password-wrap">
              <input
                id="loginPassword"
                type={showPwd ? "text" : "password"}
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
                value={form.password}
                onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: "" })); }}
                autoComplete="current-password"
                disabled={loading}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Remember + Forgot */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#526173", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm((p) => ({ ...p, remember: e.target.checked }))}
                style={{ width: 15, height: 15, accentColor: "#2563eb" }}
              />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ fontSize: 12, color: "#2563eb", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Signing in…" : "🔑 Login"}
          </button>

        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
