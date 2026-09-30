import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Shield,
  Save,
} from "lucide-react";

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");

  const [settings, setSettings] = useState({
    name: "Hospital Admin",
    email: "admin@ethiocare.com",
    phone: "+251 900 000 000",
    emailNotifications: true,
    appointmentNotifications: true,
    systemNotifications: true,
    darkMode: false,
    language: "English",
  });

  const handleChange = (field, value) => {
    setSettings((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = () => {
    alert("Settings saved successfully.");
  };

  return (
    <div className="settings-page">

      {/* ================================
          PAGE HEADER
      ================================= */}

      <div className="settings-page-header">

        <div>
          <h1>Settings</h1>

          <p>
            Manage your account and system preferences
          </p>
        </div>

        <button
          className="settings-save-btn"
          onClick={handleSave}
        >
          <Save size={17} />
          Save Changes
        </button>

      </div>


      {/* ================================
          SETTINGS LAYOUT
      ================================= */}

      <div className="settings-layout">

        {/* ================================
            SETTINGS SIDEBAR
        ================================= */}

        <div className="settings-navigation">

          <button
            className={
              activeSection === "profile"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("profile")}
          >
            <User size={18} />
            <span>Profile</span>
          </button>


          <button
            className={
              activeSection === "notifications"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("notifications")}
          >
            <Bell size={18} />
            <span>Notifications</span>
          </button>


          <button
            className={
              activeSection === "security"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("security")}
          >
            <Lock size={18} />
            <span>Security</span>
          </button>


          <button
            className={
              activeSection === "appearance"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("appearance")}
          >
            <Palette size={18} />
            <span>Appearance</span>
          </button>


          <button
            className={
              activeSection === "system"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("system")}
          >
            <Globe size={18} />
            <span>System</span>
          </button>


          <button
            className={
              activeSection === "privacy"
                ? "settings-nav-item active"
                : "settings-nav-item"
            }
            onClick={() => setActiveSection("privacy")}
          >
            <Shield size={18} />
            <span>Privacy</span>
          </button>

        </div>


        {/* ================================
            SETTINGS CONTENT
        ================================= */}

        <div className="settings-content">

          {/* ================================
              PROFILE
          ================================= */}

          {activeSection === "profile" && (

            <div className="settings-card">

              <div className="settings-card-header">
                <div>
                  <h2>Profile Information</h2>
                  <p>
                    Update your administrator account information.
                  </p>
                </div>
              </div>


              <div className="settings-avatar-section">

                <div className="settings-large-avatar">
                  HA
                </div>

                <div>
                  <strong>Hospital Admin</strong>

                  <span>
                    Administrator account
                  </span>
                </div>

              </div>


              <div className="settings-form-grid">

                <div className="settings-field">

                  <label>Full Name</label>

                  <input
                    type="text"
                    value={settings.name}
                    onChange={(event) =>
                      handleChange(
                        "name",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="settings-field">

                  <label>Email Address</label>

                  <input
                    type="email"
                    value={settings.email}
                    onChange={(event) =>
                      handleChange(
                        "email",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="settings-field">

                  <label>Phone Number</label>

                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(event) =>
                      handleChange(
                        "phone",
                        event.target.value
                      )
                    }
                  />

                </div>


                <div className="settings-field">

                  <label>Role</label>

                  <input
                    type="text"
                    value="Hospital Administrator"
                    disabled
                  />

                </div>

              </div>

            </div>

          )}


          {/* ================================
              NOTIFICATIONS
          ================================= */}

          {activeSection === "notifications" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Notifications</h2>

                  <p>
                    Choose which notifications you want to receive.
                  </p>
                </div>

              </div>


              <div className="settings-option">

                <div>
                  <strong>Email Notifications</strong>

                  <span>
                    Receive important system updates by email.
                  </span>
                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(event) =>
                      handleChange(
                        "emailNotifications",
                        event.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>


              <div className="settings-option">

                <div>
                  <strong>Appointment Notifications</strong>

                  <span>
                    Receive notifications about appointments.
                  </span>
                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.appointmentNotifications
                    }
                    onChange={(event) =>
                      handleChange(
                        "appointmentNotifications",
                        event.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>


              <div className="settings-option">

                <div>
                  <strong>System Notifications</strong>

                  <span>
                    Receive important hospital system alerts.
                  </span>
                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    checked={
                      settings.systemNotifications
                    }
                    onChange={(event) =>
                      handleChange(
                        "systemNotifications",
                        event.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

            </div>

          )}


          {/* ================================
              SECURITY
          ================================= */}

          {activeSection === "security" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Security</h2>

                  <p>
                    Manage your account security settings.
                  </p>
                </div>

              </div>


              <div className="settings-field">

                <label>Current Password</label>

                <input
                  type="password"
                  placeholder="Enter current password"
                />

              </div>


              <div className="settings-field">

                <label>New Password</label>

                <input
                  type="password"
                  placeholder="Enter new password"
                />

              </div>


              <div className="settings-field">

                <label>Confirm New Password</label>

                <input
                  type="password"
                  placeholder="Confirm new password"
                />

              </div>

            </div>

          )}


          {/* ================================
              APPEARANCE
          ================================= */}

          {activeSection === "appearance" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Appearance</h2>

                  <p>
                    Customize how EthioCare looks.
                  </p>
                </div>

              </div>


              <div className="settings-option">

                <div>
                  <strong>Dark Mode</strong>

                  <span>
                    Use a dark interface throughout the system.
                  </span>
                </div>

                <label className="settings-switch">

                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={(event) =>
                      handleChange(
                        "darkMode",
                        event.target.checked
                      )
                    }
                  />

                  <span></span>

                </label>

              </div>

            </div>

          )}


          {/* ================================
              SYSTEM
          ================================= */}

          {activeSection === "system" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>System Preferences</h2>

                  <p>
                    Configure your hospital system preferences.
                  </p>
                </div>

              </div>


              <div className="settings-field">

                <label>Language</label>

                <select
                  value={settings.language}
                  onChange={(event) =>
                    handleChange(
                      "language",
                      event.target.value
                    )
                  }
                >
                  <option>English</option>
                  <option>Amharic</option>
                </select>

              </div>


              <div className="settings-info-box">

                <strong>EthioCare Hospital Management System</strong>

                <span>
                  System version 1.0.0
                </span>

              </div>

            </div>

          )}


          {/* ================================
              PRIVACY
          ================================= */}

          {activeSection === "privacy" && (

            <div className="settings-card">

              <div className="settings-card-header">

                <div>
                  <h2>Privacy</h2>

                  <p>
                    Manage privacy and data preferences.
                  </p>
                </div>

              </div>


              <div className="settings-info-box">

                <strong>Patient Data Protection</strong>

                <span>
                  Patient medical information should only
                  be accessed by authorized hospital staff.
                </span>

              </div>


              <div className="settings-info-box">

                <strong>Account Privacy</strong>

                <span>
                  Your administrator account information
                  is protected by the hospital system.
                </span>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Settings;