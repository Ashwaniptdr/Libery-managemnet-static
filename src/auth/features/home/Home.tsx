import React from 'react';
import { useNavigate } from 'react-router';
import { getCurrentUser } from 'shared/utils/auth';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const links = [
    {
      id: 'books-list',
      icon: 'pi pi-book',
      title: 'Books Catalog',
      desc: 'Browse & search 5,000+ volumes across 9 AIGGPA Centers',
      path: '/books',
      color: 'blue',
    },
    {
      id: 'books-add',
      icon: 'pi pi-plus-circle',
      title: 'Register Book / Report',
      desc: 'Accession a new book, center report, or external publication',
      path: '/books/add',
      color: 'green',
    },
    {
      id: 'borrow-list',
      icon: 'pi pi-list',
      title: 'Issued Books Register',
      desc: 'View circulation history, active loans & return status',
      path: '/borrow',
      color: 'purple',
    },
    {
      id: 'borrow-issue',
      icon: 'pi pi-share-alt',
      title: 'Issue Book',
      desc: 'Issue a book to an officer or researcher (30-day limit)',
      path: '/borrow/issue',
      color: 'orange',
    },
    {
      id: 'audit',
      icon: 'pi pi-check-circle',
      title: 'Annual Book Audit',
      desc: 'Physical inventory verification, barcode logs & audit remarks',
      path: '/audit',
      color: 'yellow',
    },
    {
      id: 'dashboard',
      icon: 'pi pi-chart-bar',
      title: 'Analytics Dashboard',
      desc: 'Graphical KPIs, stock charts & trend reports by category',
      path: '/dashboard',
      color: 'teal',
    },
  ];

  return (
    <div className="home-page">
      {/* Welcome Header */}
      <div className="home-welcome">
        <div className="home-welcome-text">
          <h1 className="home-welcome-title">
            Welcome , {user.name.split(' ')[0]} 👋
          </h1>
          <p className="home-welcome-sub">
            AIGGPA Library &amp; Publications Portal &mdash; {user.role}
          </p>
        </div>
        <div className="home-welcome-badge">
          <div className="home-avatar">{user.avatarText}</div>
        </div>
      </div>

      {/* Section label */}
      <div className="home-section-label">
        <i className="pi pi-th-large" />
        <span>Quick Links &mdash; Select a section to begin</span>
      </div>

      {/* Quick Link Cards — direct click, no sub-buttons */}
      <div className="home-links-grid">
        {links.map(link => (
          <button
            key={link.id}
            id={link.id}
            className={`home-link-card home-link-card--${link.color}`}
            onClick={() => navigate(link.path)}
          >
            <div className={`home-link-icon home-link-icon--${link.color}`}>
              <i className={link.icon} />
            </div>
            <div className="home-link-content">
              <div className="home-link-title">{link.title}</div>
              <div className="home-link-desc">{link.desc}</div>
            </div>
            <div className="home-link-arrow">
              <i className="pi pi-arrow-right" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
