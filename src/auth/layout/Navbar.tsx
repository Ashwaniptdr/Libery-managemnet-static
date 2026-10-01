import React from 'react';
import { NavLink } from 'react-router';
import './Navbar.css';

interface NavbarProps {
  isSidebarMode: boolean;
}

export default function Navbar({ isSidebarMode }: NavbarProps) {
  // If sidebar mode is enabled on desktop, we can hide the top navbar or keep it as breadcrumb/quick links
  if (isSidebarMode) return null;

  return (
    <nav className="navbar no-print">
      <ul className="navbar-list">
        <li className="navbar-item">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <i className="pi pi-th-large" />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/books"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <i className="pi pi-book" />
            <span>Books Registry</span>
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/borrow"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <i className="pi pi-share-alt" />
            <span>Book Borrowing</span>
          </NavLink>
        </li>

        <li className="navbar-item">
          <NavLink
            to="/audit"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <i className="pi pi-check-circle" />
            <span>Annual Audit</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
