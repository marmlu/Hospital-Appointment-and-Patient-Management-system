
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarCheck,
  Building2,
  FileText,
  Pill,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();

  /* =================================================
     ALL SIDEBAR MENU ITEMS
     ================================================= */

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Patients",
      path: "/patients",
      icon: Users,
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: Stethoscope,
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: CalendarCheck,
    },
    {
      name: "Departments",
      path: "/departments",
      icon: Building2,
    },
    {
      name: "Records",
      path: "/medical-records",
      icon: FileText,
    },
    {
      name: "Prescriptions",
      path: "/prescriptions",
      icon: Pill,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: BarChart3,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  /* =================================================
     LOGOUT
     ================================================= */

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/");
  };

  /* =================================================
     SIDEBAR
     ================================================= */

  return (
    <aside
      className={
        collapsed
          ? "sidebar sidebar-collapsed"
          : "sidebar"
      }
    >

      {/* =================================================
          ETHIOCARE LOGO
         ================================================= */}

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">

          {/* FILLED HEART + HEARTBEAT / EKG */}
          <svg
            width="30"
            height="30"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="EthioCare medical logo"
          >

            {/* Filled Heart */}
            <path
              d="
                M20 35
                C18.8 33.8 5 24.5 5 14.8
                C5 9.6 8.7 5.5 13.8 5.5
                C16.6 5.5 19.1 7 20 9.4
                C20.9 7 23.4 5.5 26.2 5.5
                C31.3 5.5 35 9.6 35 14.8
                C35 24.5 21.2 33.8 20 35Z
              "
              fill="currentColor"
            />

            {/* Heartbeat / EKG Line */}
            <path
              d="
                M7.8 19.5
                H13
                L15.2 15
                L18 24.5
                L21 12.5
                L24 22
                L26 19.5
                H32.2
              "
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

          </svg>

        </div>

        <div className="sidebar-logo-text">

          <strong>
            EthioCare
          </strong>

          <span>
            Hospital Management
          </span>

        </div>

      </div>


      {/* =================================================
          COLLAPSE BUTTON
         ================================================= */}

      <button
        className="sidebar-toggle"
        onClick={() =>
          setCollapsed(!collapsed)
        }
        title={
          collapsed
            ? "Expand sidebar"
            : "Collapse sidebar"
        }
      >

        {collapsed ? (
          <ChevronRight size={15} />
        ) : (
          <ChevronLeft size={15} />
        )}

      </button>


      {/* =================================================
          SIDEBAR MENU
         ================================================= */}

      <nav className="sidebar-menu">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              title={
                collapsed
                  ? item.name
                  : ""
              }
            >

              <span className="sidebar-item-icon">
                <Icon size={20} />
              </span>

              <span className="sidebar-item-text">
                {item.name}
              </span>

            </NavLink>
          );

        })}


        {/* =================================================
            LOGOUT
           ================================================= */}

        <button
          className="sidebar-item logout"
          onClick={handleLogout}
          title={
            collapsed
              ? "Logout"
              : ""
          }
        >

          <span className="sidebar-item-icon">
            <LogOut size={20} />
          </span>

          <span className="sidebar-item-text">
            Logout
          </span>

        </button>

      </nav>


      {/* =================================================
          LOGOUT CONFIRMATION MODAL
         ================================================= */}

      {showLogoutModal && (

        <div
          className="logout-modal-overlay"
          onClick={() =>
            setShowLogoutModal(false)
          }
        >

          <div
            className="logout-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="logout-modal-icon">
              <LogOut size={24} />
            </div>

            <h2>
              Logout from EthioCare?
            </h2>

            <p>
              Are you sure you want to logout
              from the EthioCare Hospital
              Management System?
            </p>

            <div className="logout-modal-actions">

              <button
                className="cancel-logout-btn"
                onClick={() =>
                  setShowLogoutModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-logout-btn"
                onClick={confirmLogout}
              >

                <LogOut size={16} />

                Logout

              </button>

            </div>

          </div>

        </div>

      )}

    </aside>
  );
}

export default Sidebar;
