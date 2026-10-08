import React from 'react';
import './BorrowerCreditCard.css';

interface BorrowerCreditCardProps {
  score: Library.BorrowerCreditScore;
  centerOrSection?: string;
  designation?: string;
  joiningDate?: string;
  contractEndDate?: string;
}

function computeCreditScore(records: Library.BorrowItem[]): Library.BorrowerCreditScore {
  const totalBorrows = records.length;
  const currentlyHeld = records.filter(r => r.status === 'ISSUED').length;
  const overdueCount = records.filter(r => r.status === 'OVERDUE').length;
  const returnedOnTime = records.filter(
    r => r.status === 'RETURNED' && r.returnDate != null && r.returnDate <= r.dueDate
  ).length;
  const reissueCount = records.reduce((sum, r) => sum + r.reissueCount, 0);

  const score = Math.max(
    0,
    Math.min(
      100,
      100 - overdueCount * 15 - reissueCount * 5 + Math.min(returnedOnTime * 3, 30)
    )
  );

  const creditGrade: Library.BorrowerCreditScore['creditGrade'] =
    score >= 85 ? 'EXCELLENT' : score >= 65 ? 'GOOD' : score >= 45 ? 'FAIR' : 'POOR';

  return {
    borrowerName: records[0]?.borrowerName ?? '',
    totalBorrows,
    currentlyHeld,
    overdueCount,
    returnedOnTime,
    reissueCount,
    creditScore: score,
    creditGrade,
    recentBorrows: records.slice(0, 5),
  };
}

export { computeCreditScore };

export default function BorrowerCreditCard({
  score,
  centerOrSection,
  designation,
  joiningDate,
  contractEndDate,
}: BorrowerCreditCardProps) {
  const statusBadge = (status: Library.BorrowStatus) => {
    switch (status) {
      case 'RETURNED': return <span className="bcc-status-badge returned">RETURNED</span>;
      case 'ISSUED': return <span className="bcc-status-badge issued">ISSUED</span>;
      case 'OVERDUE': return <span className="bcc-status-badge overdue">OVERDUE</span>;
      case 'REISSUED': return <span className="bcc-status-badge reissued">REISSUED</span>;
      default: return <span className="bcc-status-badge">{status}</span>;
    }
  };

  const statusIcon = (status: Library.BorrowStatus) => {
    switch (status) {
      case 'RETURNED': return '✅';
      case 'ISSUED': return '📖';
      case 'OVERDUE': return '⚠️';
      case 'REISSUED': return '🔄';
      default: return '•';
    }
  };

  const displayDesignation = designation || score.recentBorrows[0]?.designation || '';
  const displayCenter = centerOrSection || score.recentBorrows[0]?.centerOrSection || '';
  const subText = displayDesignation && displayCenter 
    ? `${displayDesignation} • ${displayCenter}`
    : displayDesignation || displayCenter || 'Borrower Profile';

  return (
    <div className="bcc-card">
      {/* Header */}
      <div className="bcc-header">
        <div className="bcc-avatar">
          <i className="pi pi-user" />
        </div>
        <div className="bcc-name-area">
          <div className="bcc-name">{score.borrowerName}</div>
          <div className="bcc-sub">{subText}</div>
        </div>
      </div>

      {/* Tenured Employment Details (Joining Date & Contract End Date) */}
      <div className="bcc-dates-banner">
        <div className="bcc-date-item">
          <span className="bcc-date-icon">📅</span>
          <div className="bcc-date-content">
            <span className="bcc-date-label">Joining Date</span>
            <strong className="bcc-date-value">{joiningDate || '2023-06-15'}</strong>
          </div>
        </div>
        <div className="bcc-date-divider" />
        <div className="bcc-date-item">
          <span className="bcc-date-icon">⏳</span>
          <div className="bcc-date-content">
            <span className="bcc-date-label">Contract End Date</span>
            <strong className="bcc-date-value">{contractEndDate || '2027-06-14'}</strong>
          </div>
        </div>
      </div>

      {/* Stats Grid - 3 Key Metrics per requirement */}
      <div className="bcc-stats-grid bcc-three-metrics">
        <div className="bcc-stat">
          <span className="bcc-stat-icon">📚</span>
          <span className="bcc-stat-value">{score.totalBorrows}</span>
          <span className="bcc-stat-label">No. of Books Issued Until Now</span>
        </div>
        <div className="bcc-stat">
          <span className="bcc-stat-icon">📖</span>
          <span className="bcc-stat-value">{score.currentlyHeld}</span>
          <span className="bcc-stat-label">No. of Books Currently Borrowed</span>
        </div>
        <div className={`bcc-stat ${score.overdueCount > 0 ? 'danger' : ''}`}>
          <span className="bcc-stat-icon">⚠️</span>
          <span className="bcc-stat-value">{score.overdueCount}</span>
          <span className="bcc-stat-label">Books Crossed Return Date</span>
        </div>
      </div>

      {/* Recent Borrows */}
      {score.recentBorrows.length > 0 && (
        <div className="bcc-recent">
          <div className="bcc-recent-title">Recent Borrowing Records</div>
          <ul className="bcc-recent-list">
            {score.recentBorrows.map(b => (
              <li key={b.borrowId} className="bcc-recent-item">
                <span className="bcc-recent-icon">{statusIcon(b.status)}</span>
                <span className="bcc-recent-book" title={b.bookTitle}>{b.bookTitle}</span>
                {statusBadge(b.status)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
