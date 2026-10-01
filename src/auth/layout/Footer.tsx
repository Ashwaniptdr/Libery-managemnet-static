import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer no-print">
      <div className="footer-left">
        <strong>AIGGPA Library Management</strong> &bull; Atal Bihari Vajpayee Institute of Good Governance and Policy Analysis
      </div>
      <div className="footer-right">
        <span>Total Books: ~5,000</span>
        <span>Version 1.0 (Static Prototype)</span>
      </div>
    </footer>
  );
}
