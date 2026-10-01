import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_USER = {
  name:      "John Doe",
  email:     "john@gmail.com",
  phone:     "+251 900 000 000",
  role:      "Patient",
  gender:    "Male",
  dob:       "January 15, 1990",
  bloodGroup:"O+",
  id:        "PT-10001",
  joinDate:  "January 5, 2026",
};

function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [user, setUser]       = useState(DEMO_USER);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState({ ...DEMO_USER });
  const [saveMsg, setSaveMsg] = useState(null);

  function handleLogout() {
    onLogout && onLogout();
    navigate("/login");
  }

  function handleSave(e) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.email.trim()) {
      setSaveMsg({ type: "error", msg: "Name and email are required." });
      return;
    }
    setUser({ ...user, ...draft });
    setSaveMsg({ type: "success", msg: "Profile updated successfully!" });
    setTimeout(() => { setSaveMsg(null); setEditing(false); }, 1500);
  }

  return (
    <div className="profile-wrapper">

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", color: "#7b899b", marginBottom: 4 }}>Account</p>
        <h1 style={{ fontSize: 26, fontWeight: 750, color: "#172033", letterSpacing: "-0.4px" }}>My Profile</h1>
        <p style={{ fontSize: 13, color: "#7b899b", marginTop: 5 }}>View and manage your personal information.</p>
      </div>

      <div className="profile-grid">

        {/* ── Avatar card ── */}
        <div className="profile-card">
          <div className="profile-avatar">👤</div>
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <span className="profile-role-badge">{user.role}</span>

          <div className="profile-info-list">
            {[
              { icon: "📧", label: "Email",  value: user.email  },
              { icon: "📞", label: "Phone",  value: user.phone  },
              { icon: "🛡️", label: "Role",   value: user.role   },
              { icon: "📅", label: "Member Since", value: "January 2026" },
            ].map((item) => (
              <div className="profile-info-item" key={item.label}>
                <span className="info-icon">{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setEditing((v) => !v)}>
              ✏️ {editing ? "Cancel Edit" : "Edit Profile"}
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ── Right column ── */}
        <div>

          {/* Personal Info */}
          <div className="profile-details-card" style={{ marginBottom: 20 }}>
            <h3>👤 Personal Information</h3>
            <div className="detail-row">
              {[
                ["Full Name",     user.name],
                ["Email Address", user.email],
                ["Phone Number",  user.phone],
                ["Date of Birth", user.dob],
                ["Gender",        user.gender],
                ["Blood Group",   user.bloodGroup],
              ].map(([label, val]) => (
                <div className="detail-field" key={label}>
                  <label>{label}</label>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="profile-details-card" style={{ marginBottom: 20 }}>
            <h3>🪪 Account Information</h3>
            <div className="detail-row">
              {[
                ["User ID",        user.id],
                ["Role",           user.role],
                ["Account Status", "✅ Active"],
                ["Registered",     user.joinDate],
              ].map(([label, val]) => (
                <div className="detail-field" key={label}>
                  <label>{label}</label>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          {editing && (
            <div className="profile-details-card">
              <h3>✏️ Edit Profile</h3>

              {saveMsg && (
                <div className={`alert alert-${saveMsg.type}`} style={{ marginBottom: 16 }}>
                  <span className="alert-icon">{saveMsg.type === "error" ? "⚠️" : "✅"}</span>
                  <span>{saveMsg.msg}</span>
                </div>
              )}

              <form onSubmit={handleSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="editName">Full Name</label>
                    <input id="editName" type="text" value={draft.name}
                      onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEmail">Email Address</label>
                    <input id="editEmail" type="email" value={draft.email}
                      onChange={(e) => setDraft((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPhone">Phone Number</label>
                    <input id="editPhone" type="tel" value={draft.phone}
                      onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editGender">Gender</label>
                    <select id="editGender" value={draft.gender}
                      onChange={(e) => setDraft((p) => ({ ...p, gender: e.target.value }))}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <button type="submit" className="btn btn-primary btn-sm">💾 Save Changes</button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditing(false); setDraft({ ...user }); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
