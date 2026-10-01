import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim())            e.name = "Full name is required.";
    else if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
    if (!form.email)                  e.email = "Email address is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.password)               e.password = "Password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword)        e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
  }

  function update(field) {
    return (e) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setAlert({ type: "success", msg: "Account created successfully! Redirecting to login…" });
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card auth-card-wide">

        <div className="auth-logo">
          <div className="logo-icon">🏥</div>
          <span>EthioCare</span>
        </div>

        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join EthioCare and manage your healthcare information easily.</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span className="alert-icon">{alert.type === "error" ? "⚠️" : "✅"}</span>
            <span>{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="regName">👤 Full Name</label>
            <input
              id="regName" type="text" placeholder="John Doe"
              className={errors.name ? "error" : ""}
              value={form.name} onChange={update("name")}
              autoComplete="name" disabled={loading}
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="regEmail">📧 Email Address</label>
            <input
              id="regEmail" type="email" placeholder="john@gmail.com"
              className={errors.email ? "error" : ""}
              value={form.email} onChange={update("email")}
              autoComplete="email" disabled={loading}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* Password + Confirm */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="regPassword">🔒 Password</label>
              <div className="input-password-wrap">
                <input
                  id="regPassword"
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  className={errors.password ? "error" : ""}
                  value={form.password} onChange={update("password")}
                  autoComplete="new-password" disabled={loading}
                />
                <button type="button" className="toggle-password" onClick={() => setShowPwd((v) => !v)}>
                  {showPwd ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="regConfirm">🔒 Confirm Password</label>
              <div className="input-password-wrap">
                <input
                  id="regConfirm"
                  type={showConf ? "text" : "password"}
                  placeholder="Re-enter password"
                  className={errors.confirmPassword ? "error" : ""}
                  value={form.confirmPassword} onChange={update("confirmPassword")}
                  autoComplete="new-password" disabled={loading}
                />
                <button type="button" className="toggle-password" onClick={() => setShowConf((v) => !v)}>
                  {showConf ? "🙈" : "👁"}
                </button>
              </div>
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? "Creating account…" : "👤 Register"}
          </button>

        </form>

        <div className="auth-divider"><span>or</span></div>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
