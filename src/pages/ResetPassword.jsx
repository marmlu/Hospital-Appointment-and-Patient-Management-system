import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm]     = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [alert, setAlert]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);
  const [showConf, setShowConf] = useState(false);

  function validate() {
    const e = {};
    if (!form.password)              e.password = "New password is required.";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!form.confirmPassword)       e.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match.";
    return e;
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
    setAlert({ type: "success", msg: "Password reset successfully! Redirecting to login…" });
    setTimeout(() => navigate("/login"), 1500);
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">

        <div className="auth-logo">
          <div className="logo-icon">🔑</div>
          <span>EthioCare</span>
        </div>

        <div className="auth-header">
          <h2>Reset Password</h2>
          <p>Create a new strong password for your account.</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type}`}>
            <span className="alert-icon">✅</span>
            <span>{alert.msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="resetPassword">🔒 New Password</label>
            <div className="input-password-wrap">
              <input
                id="resetPassword"
                type={showPwd ? "text" : "password"}
                placeholder="Min. 6 characters"
                className={errors.password ? "error" : ""}
                value={form.password}
                onChange={(e) => { setForm((p) => ({ ...p, password: e.target.value })); setErrors((p) => ({ ...p, password: "" })); }}
                autoComplete="new-password" disabled={loading}
              />
              <button type="button" className="toggle-password" onClick={() => setShowPwd((v) => !v)}>
                {showPwd ? "🙈" : "👁"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="resetConfirm">🔒 Confirm New Password</label>
            <div className="input-password-wrap">
              <input
                id="resetConfirm"
                type={showConf ? "text" : "password"}
                placeholder="Re-enter new password"
                className={errors.confirmPassword ? "error" : ""}
                value={form.confirmPassword}
                onChange={(e) => { setForm((p) => ({ ...p, confirmPassword: e.target.value })); setErrors((p) => ({ ...p, confirmPassword: "" })); }}
                autoComplete="new-password" disabled={loading}
              />
              <button type="button" className="toggle-password" onClick={() => setShowConf((v) => !v)}>
                {showConf ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? "Resetting…" : "🔑 Reset Password"}
          </button>

          <Link to="/login" className="btn btn-secondary btn-full">
            ← Back to Login
          </Link>

        </form>

      </div>
    </div>
  );
}

export default ResetPassword;
