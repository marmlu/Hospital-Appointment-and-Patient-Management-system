import { useState } from "react";
import { Bell, CalendarDays, Menu, Search, X } from "lucide-react";

export default function Topbar({ onMenu, notifications, clearNotifications }) {
  const [noticeOpen, setNoticeOpen] = useState(false);

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu}><Menu size={22}/></button>
      <div className="global-search">
        <Search size={18} />
        <input placeholder="Search patients, records, prescriptions..." />
        <kbd>⌘ K</kbd>
      </div>

      <div className="topbar-actions">
        <div className="today-chip"><CalendarDays size={16}/> <span>Aug 26, 2026</span></div>
        <div className="notice-wrap">
          <button className="icon-btn" onClick={() => setNoticeOpen(v => !v)} aria-label="Notifications">
            <Bell size={19}/>
            {notifications > 0 && <span className="notification-badge">{notifications}</span>}
          </button>
          {noticeOpen && (
            <div className="notification-popover">
              <div className="popover-head">
                <strong>Notifications</strong>
                <button onClick={() => setNoticeOpen(false)}><X size={16}/></button>
              </div>
              <div className="notice-item"><span className="notice-dot teal"/><div><strong>3 appointments</strong><p>need attention today.</p></div></div>
              <div className="notice-item"><span className="notice-dot amber"/><div><strong>2 prescriptions</strong><p>are due for review.</p></div></div>
              <button className="clear-notice" onClick={clearNotifications}>Mark all as read</button>
            </div>
          )}
        </div>
        <div className="top-profile"><div className="avatar">DS</div><div><strong>Dr. Sara</strong><span>Administrator</span></div></div>
      </div>
    </header>
  );
}