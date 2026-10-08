import React from 'react';
import { NavLink } from 'react-router';
import './Sidebar.css';

interface SidebarProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isMobile: boolean;
  isSidebarMode: boolean;
}

export default function Sidebar({
  isMenuOpen,
  setIsMenuOpen,
  isMobile,
  isSidebarMode,
}: SidebarProps) {
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const isVisible = isMobile ? isMenuOpen : isSidebarMode;

  return (
    <>
      <aside
        className={`sidebar-container no-print ${!isVisible ? 'closed' : ''}`}
      >
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-icon">
            <img
              src="/assets/images/logo.png"
              alt="AIGGPA Logo"
              className="sidebar-header-logo-img"
            />
          </div>
          <div className="sidebar-header-title">
            <h2>AIGGPA Library</h2>
            <p>Knowledge Management</p>
          </div>
          {isMobile && (
            <button
              className="sidebar-close-btn"
              onClick={() => setIsMenuOpen(false)}
            >
              &times;
            </button>
          )}
        </div>

        <div className="sidebar-section-title">Navigation</div>

        <ul className="sidebar-menu">
          {/* Home */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-home" />
              <span>Home</span>
            </NavLink>
          </li>

          {/* Dashboard / Analytics */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-th-large" />
              <span>Analytics Dashboard</span>
            </NavLink>
          </li>

          {/* Books Registry */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/books"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-book" />
              <span>Books Registry</span>
            </NavLink>
          </li>

          {/* Book Borrowing */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/borrow"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-share-alt" />
              <span>Book Borrowing</span>
            </NavLink>
          </li>

          {/* Annual Audit */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/audit"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-check-circle" />
              <span>Annual Book Audit</span>
            </NavLink>
          </li>
        </ul>

        <div className="sidebar-section-title">Masters</div>

        <ul className="sidebar-menu">
          {/* Newspapers & Magazines Master */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/masters/newspapers"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-calendar" />
              <span>Newspapers &amp; Mags</span>
            </NavLink>
          </li>

          {/* Designation Borrowing Duration Master */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/masters/borrowing-rules"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-clock" />
              <span>Borrowing Durations</span>
            </NavLink>
          </li>

          {/* Projects Master */}
          <li className="sidebar-menu-item">
            <NavLink
              to="/masters/projects"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <i className="pi pi-folder" />
              <span>Projects Master</span>
            </NavLink>
          </li>
        </ul>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-footer-title">AIGGPA Bhopal &copy; 2026</div>
          <div className="sidebar-footer-sub">
            Library &amp; Publications Portal
          </div>
        </div>

        {/* Decorative Corner Logo Watermark */}
        <div className="sidebar-corner-decor" aria-hidden="true">
          <img
            src="/assets/images/logo.png"
            alt=""
            className="sidebar-corner-watermark-img"
          />
        </div>
      </aside>

      {isMobile && isMenuOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsMenuOpen(false)} />
      )}
    </>
  );
}
