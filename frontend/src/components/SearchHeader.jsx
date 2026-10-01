
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  Settings,
  LogOut,
  CalendarDays,
  FileText,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function SearchHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  /* =====================================================
     PAGE TITLE
     ===================================================== */

;const getPageTitle = () => {
    const path = location.pathname;

    if (path === "/patient-dashboard") {
        return "Patient Dashboard";
    }

    if (path === "/patients") {
        return "Patients";
    }

    if (path === "/patients/add") {
        return "Add Patient";
    }

    if (path.startsWith("/patients/edit/")) {
        return "Edit Patient";
    }

    if (path.startsWith("/patient-details/")) {
        return "Patient Details";
    }

    switch (path) {
        case "/":
            return "Dashboard";

        case "/doctors":
            return "Doctors";

        case "/appointments":
            return "Appointments";

        case "/departments":
            return "Departments";

        case "/medical-records":
            return "Medical Records";

        case "/prescriptions":
            return "Prescriptions";

        case "/reports":
            return "Reports";

        case "/settings":
            return "Settings";

        default:
            return "Dashboard";
    }
};

  /* =====================================================
     CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
     ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     ESCAPE KEY
     CLOSE LOGOUT MODAL
     ===================================================== */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowLogoutModal(false);
      }
    };

    if (showLogoutModal) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showLogoutModal]);

  /* =====================================================
     SEARCH
     ===================================================== */

  const handleSearch = (event) => {
    event.preventDefault();

    const value = search.trim();

    if (!value) return;

    navigate(`/patients?search=${encodeURIComponent(value)}`);
  };

  /* =====================================================
     NOTIFICATION NAVIGATION
     ===================================================== */

  const handleNotificationClick = (path) => {
    setShowNotifications(false);
    navigate(path);
  };

  /* =====================================================
     PROFILE ACTIONS
     ===================================================== */

  const handleSettings = () => {
    setShowProfile(false);
    navigate("/settings");
  };

  /* =====================================================
     OPEN LOGOUT CONFIRMATION
     ===================================================== */

  const handleLogoutClick = () => {
    setShowProfile(false);
    setShowNotifications(false);
    setShowLogoutModal(true);
  };

  /* =====================================================
     CONFIRM LOGOUT
     ===================================================== */

  const confirmLogout = () => {
    setShowLogoutModal(false);

    // Remove authentication token
    localStorage.removeItem("token");

    // If your project stores user information,
    // these can also be removed safely.
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  /* =====================================================
     CANCEL LOGOUT
     ===================================================== */

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* =================================================
          TOP NAVBAR
          ================================================= */}

      <header className="top-navbar">

        {/* ===============================================
            LEFT SIDE
            =============================================== */}

        <div className="top-navbar-left">

          <div className="top-navbar-page-title">
            <h1>{getPageTitle()}</h1>

            <span>
              Hospital Management System
            </span>
          </div>

        </div>


        {/* ===============================================
            SEARCH
            =============================================== */}

        <div className="navbar-search-wrapper">

          <form
            className="navbar-search"
            onSubmit={handleSearch}
          >

            <Search
              size={19}
              strokeWidth={2}
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search patients, doctors, records..."
              aria-label="Search"
            />

          </form>

        </div>


        {/* ===============================================
            RIGHT SIDE
            =============================================== */}

        <div className="top-navbar-actions">


          {/* =============================================
              NOTIFICATION
              ============================================= */}

          <div
            className="notification-wrapper"
            ref={notificationRef}
          >

            <button
              type="button"
              className="notification-btn"
              onClick={() => {
                setShowNotifications((value) => !value);
                setShowProfile(false);
              }}
              aria-label="Notifications"
            >

              <Bell
                size={25}
                strokeWidth={2}
              />

              <span className="notification-badge">
                5
              </span>

            </button>


            {/* =========================================
                NOTIFICATION DROPDOWN
                ========================================= */}

            {showNotifications && (
              <div className="notification-dropdown">

                <div className="notification-dropdown-header">

                  <h3>
                    Notifications
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    aria-label="Close notifications"
                  >
                    <X size={17} />
                  </button>

                </div>


                {/* NEW APPOINTMENT */}

                <button
                  type="button"
                  className="notification-item"
                  onClick={() =>
                    handleNotificationClick("/appointments")
                  }
                >

                  <div className="notification-item-icon">
                    <CalendarDays size={17} />
                  </div>

                  <div className="notification-item-content">

                    <strong>
                      New appointment
                    </strong>

                    <span>
                      A new appointment has been scheduled.
                    </span>

                  </div>

                </button>


                {/* MEDICAL RECORD */}

                <button
                  type="button"
                  className="notification-item"
                  onClick={() =>
                    handleNotificationClick("/medical-records")
                  }
                >

                  <div className="notification-item-icon">
                    <FileText size={17} />
                  </div>

                  <div className="notification-item-content">

                    <strong>
                      Medical record updated
                    </strong>

                    <span>
                      A patient medical record was updated.
                    </span>

                  </div>

                </button>


                {/* APPOINTMENT COMPLETED */}

                <button
                  type="button"
                  className="notification-item"
                  onClick={() =>
                    handleNotificationClick("/appointments")
                  }
                >

                  <div className="notification-item-icon">
                    <CheckCircle size={17} />
                  </div>

                  <div className="notification-item-content">

                    <strong>
                      Appointment completed
                    </strong>

                    <span>
                      Today's appointment was completed.
                    </span>

                  </div>

                </button>

              </div>
            )}

          </div>


          {/* =============================================
              VERTICAL DIVIDER
              ============================================= */}

          <div className="navbar-divider"></div>


          {/* =============================================
              ADMIN PROFILE
              ============================================= */}

          <div
            className="admin-profile"
            ref={profileRef}
            onClick={() => {
              setShowProfile((value) => !value);
              setShowNotifications(false);
            }}
          >

            {/* AVATAR */}

            <div className="admin-avatar">
              A
            </div>


            {/* NAME + ROLE */}

            <div className="admin-info">

              <strong>
                Admin User
              </strong>

              <span>
                Administrator
              </span>

            </div>


            {/* CHEVRON */}

            <ChevronDown
              className="admin-chevron"
              size={21}
              strokeWidth={2}
            />


            {/* =========================================
                PROFILE DROPDOWN
                ========================================= */}

            {showProfile && (
              <div
                className="admin-profile-dropdown"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <div className="admin-profile-dropdown-header">

                  <div className="admin-dropdown-avatar">
                    A
                  </div>

                  <div>

                    <strong>
                      Admin User
                    </strong>

                    <span>
                      Administrator
                    </span>

                  </div>

                </div>


                <div className="admin-dropdown-divider"></div>


                {/* SETTINGS */}

                <button
                  type="button"
                  onClick={handleSettings}
                >

                  <Settings size={17} />

                  <span>
                    Settings
                  </span>

                </button>


                {/* LOGOUT */}

                <button
                  type="button"
                  className="logout-menu-button"
                  onClick={handleLogoutClick}
                >

                  <LogOut size={17} />

                  <span>
                    Logout
                  </span>

                </button>

              </div>
            )}

          </div>

        </div>

      </header>


      {/* =================================================
          PROFESSIONAL LOGOUT CONFIRMATION MODAL
          ================================================= */}

      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              cancelLogout();
            }
          }}
        >

          <div
            className="logout-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              className="logout-modal-close"
              onClick={cancelLogout}
              aria-label="Close logout confirmation"
            >
              <X size={19} />
            </button>


            {/* ICON */}

            <div className="logout-warning-icon">
              <AlertTriangle
                size={27}
                strokeWidth={2}
              />
            </div>


            {/* CONTENT */}

            <div className="logout-modal-content">

              <h2 id="logout-title">
                Sign out of your account?
              </h2>

              <p>
                Are you sure you want to log out of the
                Hospital Management System?
              </p>

              <span className="logout-modal-note">
                You will need to sign in again to access
                your account.
              </span>

            </div>


            {/* ACTIONS */}

            <div className="logout-modal-actions">

              <button
                type="button"
                className="logout-cancel-btn"
                onClick={cancelLogout}
              >
                Cancel
              </button>

              <button
                type="button"
                className="logout-confirm-btn"
                onClick={confirmLogout}
              >

                <LogOut size={17} />

                <span>
                  Logout
                </span>

              </button>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          HEADER STYLES
          ================================================= */}

      <style>{`

        /* ================================================
           TOP NAVBAR
           ================================================ */

        .top-navbar {
          width: 100%;
          height: 76px;

          display: flex;
          align-items: center;

          padding: 0 28px;

          background: #ffffff;

          border-bottom: 1px solid #e8edf3;

          box-sizing: border-box;

          position: sticky;
          top: 0;
          z-index: 1000;
        }


        /* ================================================
           LEFT
           ================================================ */

        .top-navbar-left {
          display: flex;
          align-items: center;

          flex-shrink: 0;
        }

        .top-navbar-page-title {
          display: flex;
          flex-direction: column;

          justify-content: center;
        }

        .top-navbar-page-title h1 {
          margin: 0;

          font-size: 20px;
          line-height: 1.2;

          font-weight: 700;

          color: #172033;
        }

        .top-navbar-page-title span {
          margin-top: 3px;

          font-size: 11px;

          color: #8b95a7;
        }


        /* ================================================
           SEARCH
           ================================================ */

        .navbar-search-wrapper {
          flex: 1;

          display: flex;
          align-items: center;
          justify-content: center;

          margin-left: 35px;
          margin-right: 35px;

          min-width: 0;
        }

        .navbar-search {
          width: 100%;
          max-width: 460px;
          height: 42px;

          display: flex;
          align-items: center;

          padding: 0 14px;

          background: #f6f8fb;

          border: 1px solid #e5eaf1;

          border-radius: 10px;

          box-sizing: border-box;
        }

        .navbar-search svg {
          flex-shrink: 0;

          color: #8b95a7;
        }

        .navbar-search input {
          width: 100%;

          margin-left: 10px;

          border: none;
          outline: none;

          background: transparent;

          font-size: 13px;

          color: #273142;
        }

        .navbar-search input::placeholder {
          color: #9aa4b2;
        }


        /* ================================================
           RIGHT SIDE
           ================================================ */

        .top-navbar-actions {
          margin-left: auto;

          display: flex;
          align-items: center;

          height: 100%;

          gap: 0;

          flex-shrink: 0;
        }


        /* ================================================
           NOTIFICATION
           ================================================ */

        .notification-wrapper {
          position: relative;

          width: 54px;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .notification-btn {
          position: relative;

          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: none;

          background: transparent;

          color: #17365d;

          cursor: pointer;
        }

        .notification-btn:hover {
          color: #0e2d50;
        }


        /* RED BADGE */

        .notification-badge {
          position: absolute;

          top: 1px;
          right: -1px;

          min-width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0 6px;

          box-sizing: border-box;

          background: #f0444f;

          color: #ffffff;

          border-radius: 50%;

          font-size: 13px;
          font-weight: 700;

          line-height: 1;
        }


        /* ================================================
           DIVIDER
           ================================================ */

        .navbar-divider {
          width: 1px;
          height: 57px;

          margin: 0 20px;

          background: #dce3eb;

          flex-shrink: 0;
        }


        /* ================================================
           ADMIN PROFILE
           ================================================ */

        .admin-profile {
          position: relative;

          height: 62px;

          display: flex;
          align-items: center;

          gap: 13px;

          padding: 0;

          background: transparent;

          border: none;

          border-radius: 0;

          box-sizing: border-box;

          cursor: pointer;

          flex-shrink: 0;
        }


        /* ================================================
           AVATAR
           ================================================ */

        .admin-avatar {
          width: 62px;
          height: 62px;

          min-width: 62px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #12345a;

          color: #ffffff;

          border: 7px solid #eef3f7;

          box-sizing: border-box;

          font-size: 25px;
          font-weight: 500;

          flex-shrink: 0;
        }


        /* ================================================
           ADMIN INFORMATION
           ================================================ */

        .admin-info {
          min-width: 145px;

          display: flex;
          flex-direction: column;

          justify-content: center;

          line-height: 1.2;
        }

        .admin-info strong {
          display: block;

          margin: 0;

          font-size: 18px;
          font-weight: 600;

          color: #6686aa;

          white-space: nowrap;
        }

        .admin-info span {
          display: block;

          margin-top: 5px;

          font-size: 17px;
          font-weight: 400;

          color: #7590ae;

          white-space: nowrap;
        }


        /* ================================================
           CHEVRON
           ================================================ */

        .admin-chevron {
          margin-left: 3px;

          color: #54718f;

          flex-shrink: 0;
        }


        /* ================================================
           PROFILE DROPDOWN
           ================================================ */

        .admin-profile-dropdown {
          position: absolute;

          top: calc(100% + 12px);
          right: 0;

          width: 240px;

          padding: 10px;

          background: #ffffff;

          border: 1px solid #e5eaf1;

          border-radius: 12px;

          box-shadow:
            0 15px 40px rgba(25, 42, 70, 0.14);

          z-index: 2000;

          box-sizing: border-box;
        }


        .admin-profile-dropdown-header {
          display: flex;
          align-items: center;

          gap: 10px;

          padding: 8px;
        }


        .admin-dropdown-avatar {
          width: 42px;
          height: 42px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #12345a;

          color: #ffffff;

          font-size: 17px;
        }


        .admin-profile-dropdown-header strong {
          display: block;

          font-size: 13px;

          color: #263244;
        }

        .admin-profile-dropdown-header span {
          display: block;

          margin-top: 3px;

          font-size: 10px;

          color: #8a94a6;
        }


        .admin-dropdown-divider {
          height: 1px;

          margin: 7px 0;

          background: #edf0f4;
        }


        .admin-profile-dropdown button {
          width: 100%;

          height: 40px;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 0 10px;

          border: none;

          border-radius: 8px;

          background: transparent;

          color: #596577;

          font-size: 12px;

          cursor: pointer;

          text-align: left;
        }

        .admin-profile-dropdown button:hover {
          background: #f5f8fc;

          color: #2f80ed;
        }


        /* ================================================
           LOGOUT MENU BUTTON
           ================================================ */

        .admin-profile-dropdown .logout-menu-button {
          color: #d64545;
        }

        .admin-profile-dropdown .logout-menu-button:hover {
          background: #fff3f3;

          color: #c53030;
        }


        /* ================================================
           NOTIFICATION DROPDOWN
           ================================================ */

        .notification-dropdown {
          position: absolute;

          top: calc(100% - 1px);
          right: -100px;

          width: 320px;

          background: #ffffff;

          border: 1px solid #e5eaf1;

          border-radius: 12px;

          box-shadow:
            0 15px 40px rgba(25, 42, 70, 0.14);

          overflow: hidden;

          z-index: 2000;
        }


        .notification-dropdown-header {
          height: 52px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 16px;

          border-bottom: 1px solid #edf0f4;
        }

        .notification-dropdown-header h3 {
          margin: 0;

          font-size: 14px;

          color: #172033;
        }

        .notification-dropdown-header button {
          width: 28px;
          height: 28px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          background: transparent;

          color: #8993a2;

          cursor: pointer;
        }


        .notification-item {
          width: 100%;

          display: flex;

          gap: 11px;

          padding: 13px 16px;

          border: none;
          border-bottom: 1px solid #f0f2f5;

          background: #ffffff;

          text-align: left;

          cursor: pointer;

          box-sizing: border-box;

          font-family: inherit;
        }

        .notification-item:last-child {
          border-bottom: none;
        }

        .notification-item:hover {
          background: #fafcff;
        }


        .notification-item-icon {
          width: 34px;
          height: 34px;

          min-width: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 9px;

          background: #edf5ff;

          color: #2f80ed;
        }


        .notification-item-content {
          min-width: 0;
        }

        .notification-item-content strong {
          display: block;

          font-size: 11px;

          color: #263244;
        }

        .notification-item-content span {
          display: block;

          margin-top: 3px;

          font-size: 10px;

          line-height: 1.4;

          color: #8b95a7;
        }


        /* ================================================
           LOGOUT MODAL OVERLAY
           ================================================ */

        .logout-modal-overlay {
          position: fixed;

          inset: 0;

          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;

          box-sizing: border-box;

          background: rgba(15, 31, 52, 0.45);

          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);

          z-index: 9999;

          animation: logoutOverlayIn 0.2s ease-out;
        }


        /* ================================================
           LOGOUT MODAL
           ================================================ */

        .logout-modal {
          position: relative;

          width: 100%;
          max-width: 430px;

          padding: 32px;

          box-sizing: border-box;

          background: #ffffff;

          border: 1px solid #e8edf3;

          border-radius: 18px;

          box-shadow:
            0 25px 70px rgba(17, 34, 58, 0.22);

          text-align: center;

          animation: logoutModalIn 0.25s ease-out;
        }


        /* ================================================
           MODAL CLOSE BUTTON
           ================================================ */

        .logout-modal-close {
          position: absolute;

          top: 15px;
          right: 15px;

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          border: none;

          border-radius: 50%;

          background: #f5f7fa;

          color: #7c8798;

          cursor: pointer;

          transition: all 0.2s ease;
        }

        .logout-modal-close:hover {
          background: #edf1f5;

          color: #344054;

          transform: rotate(90deg);
        }


        /* ================================================
           WARNING ICON
           ================================================ */

        .logout-warning-icon {
          width: 68px;
          height: 68px;

          margin: 0 auto 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #fff1f1;

          color: #dc4a4a;

          border: 8px solid #fff8f8;

          box-sizing: border-box;
        }


        /* ================================================
           MODAL CONTENT
           ================================================ */

        .logout-modal-content h2 {
          margin: 0;

          font-size: 21px;

          line-height: 1.3;

          font-weight: 700;

          color: #172033;
        }

        .logout-modal-content p {
          margin: 11px 0 0;

          font-size: 13px;

          line-height: 1.6;

          color: #596577;
        }

        .logout-modal-note {
          display: block;

          margin-top: 7px;

          font-size: 11px;

          line-height: 1.5;

          color: #98a2b3;
        }


        /* ================================================
           MODAL ACTIONS
           ================================================ */

        .logout-modal-actions {
          display: flex;

          gap: 11px;

          margin-top: 27px;
        }


        .logout-modal-actions button {
          flex: 1;

          height: 44px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 8px;

          border-radius: 9px;

          font-family: inherit;

          font-size: 13px;

          font-weight: 600;

          cursor: pointer;

          transition: all 0.2s ease;
        }


        /* CANCEL */

        .logout-cancel-btn {
          border: 1px solid #dfe5ec;

          background: #ffffff;

          color: #526174;
        }

        .logout-cancel-btn:hover {
          background: #f6f8fa;

          border-color: #cfd7e1;

          color: #27364a;
        }


        /* CONFIRM LOGOUT */

        .logout-confirm-btn {
          border: 1px solid #dc4a4a;

          background: #dc4a4a;

          color: #ffffff;

          box-shadow:
            0 5px 14px rgba(220, 74, 74, 0.18);
        }

        .logout-confirm-btn:hover {
          background: #c93d3d;

          border-color: #c93d3d;

          transform: translateY(-1px);

          box-shadow:
            0 7px 18px rgba(220, 74, 74, 0.25);
        }

        .logout-confirm-btn:active {
          transform: translateY(0);
        }


        /* ================================================
           ANIMATIONS
           ================================================ */

        @keyframes logoutOverlayIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes logoutModalIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }


        /* ================================================
           RESPONSIVE
           ================================================ */

        @media (max-width: 1000px) {

          .navbar-search-wrapper {
            margin-left: 20px;
            margin-right: 20px;
          }

          .admin-info {
            min-width: 120px;
          }

          .admin-info strong {
            font-size: 15px;
          }

          .admin-info span {
            font-size: 13px;
          }

        }


        @media (max-width: 800px) {

          .top-navbar {
            padding: 0 18px;
          }

          .navbar-search-wrapper {
            margin-left: 15px;
            margin-right: 15px;
          }

          .navbar-divider {
            margin: 0 12px;
          }

          .admin-avatar {
            width: 52px;
            height: 52px;
            min-width: 52px;

            border-width: 5px;

            font-size: 21px;
          }

          .admin-info {
            min-width: 105px;
          }

          .admin-info strong {
            font-size: 14px;
          }

          .admin-info span {
            font-size: 12px;
          }

        }


        @media (max-width: 650px) {

          .top-navbar-page-title span {
            display: none;
          }

          .navbar-search-wrapper {
            display: none;
          }

          .admin-info {
            display: none;
          }

          .admin-chevron {
            display: none;
          }

          .navbar-divider {
            height: 45px;

            margin: 0 10px;
          }

          .admin-profile {
            height: 45px;
          }

          .admin-avatar {
            width: 44px;
            height: 44px;
            min-width: 44px;

            border-width: 4px;

            font-size: 18px;
          }

          .notification-wrapper {
            width: 45px;
          }

          .notification-badge {
            min-width: 21px;
            height: 21px;

            font-size: 11px;
          }


          /* MOBILE LOGOUT MODAL */

          .logout-modal {
            max-width: 380px;

            padding: 28px 22px;
          }

          .logout-modal-content h2 {
            font-size: 19px;
          }

          .logout-modal-content p {
            font-size: 12px;
          }

        }

      `}</style>
    </>
  );
}

export default SearchHeader;

