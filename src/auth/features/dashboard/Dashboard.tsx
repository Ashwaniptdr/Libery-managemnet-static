import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from 'shared/components/buttons/Button';
import Page from 'shared/components/panels/Page';
import {
  STATIC_BOOKS,
  STATIC_BORROW_RECORDS,
} from 'shared/constants/staticData';
import './Dashboard.css';

interface CenterStatData {
  centerId: number;
  code: string;
  name: string;
  advisor: string;
  available: number;
  inCirculation: number;
  secondaryCount: number;
  total: number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Mode Selection: 'BOOKS' | 'REPORTS' | 'OTHER' | 'NEWSPAPERS' via Top Radio Buttons
  const [dashboardMode, setDashboardMode] = useState<
    'BOOKS' | 'REPORTS' | 'OTHER' | 'NEWSPAPERS'
  >('BOOKS');

  // Active hover states for charts
  const [hoveredItem, setHoveredItem] = useState<CenterStatData | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ label: string; value: number } | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('All');

  // 1. Data for BOOKS Mode (5000+ Total Stock across 9 Centers)
  const bookCenterStats: CenterStatData[] = [
    {
      centerId: 1,
      code: 'CPPG',
      name: 'Centre for Public Policy & Governance',
      advisor: 'Dr. R. K. Sharma',
      available: 420,
      inCirculation: 95,
      secondaryCount: 45,
      total: 560,
    },
    {
      centerId: 2,
      code: 'CUG',
      name: 'Centre for Urban Governance',
      advisor: 'Prof. Ananya Sen',
      available: 460,
      inCirculation: 110,
      secondaryCount: 50,
      total: 620,
    },
    {
      centerId: 3,
      code: 'CRD',
      name: 'Centre for Rural Development & Panchayats',
      advisor: 'Dr. Vivek Mishra',
      available: 310,
      inCirculation: 75,
      secondaryCount: 40,
      total: 425,
    },
    {
      centerId: 4,
      code: 'CKM',
      name: 'Centre for Knowledge Management',
      advisor: 'Smt. Neeta Sharma',
      available: 320,
      inCirculation: 65,
      secondaryCount: 55,
      total: 440,
    },
    {
      centerId: 5,
      code: 'CCE',
      name: 'Centre for Climate Change & Environment',
      advisor: 'Dr. Shweta Pathak',
      available: 380,
      inCirculation: 80,
      secondaryCount: 35,
      total: 495,
    },
    {
      centerId: 6,
      code: 'CSD',
      name: 'Centre for Social Development',
      advisor: 'Dr. Pradeep Nair',
      available: 340,
      inCirculation: 85,
      secondaryCount: 45,
      total: 470,
    },
    {
      centerId: 7,
      code: 'CFM',
      name: 'Centre for Financial Management & Policy',
      advisor: 'Shri Manoj Joshi',
      available: 220,
      inCirculation: 40,
      secondaryCount: 30,
      total: 290,
    },
    {
      centerId: 8,
      code: 'CIET',
      name: 'Centre for Innovation & Emerging Tech',
      advisor: 'Dr. Rajesh Patel',
      available: 240,
      inCirculation: 50,
      secondaryCount: 40,
      total: 330,
    },
    {
      centerId: 9,
      code: 'CHRCB',
      name: 'Centre for Human Resource & Capacity',
      advisor: 'Dr. Meenakshi Tiwari',
      available: 230,
      inCirculation: 45,
      secondaryCount: 35,
      total: 310,
    },
  ];

  // 2. Data for REPORTS Mode (Center Reports & External Dept Reports)
  const reportCenterStats: CenterStatData[] = [
    {
      centerId: 1,
      code: 'CPPG',
      name: 'Centre for Public Policy & Governance',
      advisor: 'Dr. R. K. Sharma',
      available: 95,
      inCirculation: 18,
      secondaryCount: 12,
      total: 125,
    },
    {
      centerId: 2,
      code: 'CUG',
      name: 'Centre for Urban Governance',
      advisor: 'Prof. Ananya Sen',
      available: 110,
      inCirculation: 22,
      secondaryCount: 15,
      total: 147,
    },
    {
      centerId: 3,
      code: 'CRD',
      name: 'Centre for Rural Development',
      advisor: 'Dr. Vivek Mishra',
      available: 85,
      inCirculation: 14,
      secondaryCount: 10,
      total: 109,
    },
    {
      centerId: 4,
      code: 'CKM',
      name: 'Centre for Knowledge Management',
      advisor: 'Smt. Neeta Sharma',
      available: 105,
      inCirculation: 16,
      secondaryCount: 14,
      total: 135,
    },
    {
      centerId: 5,
      code: 'CCE',
      name: 'Centre for Climate Change',
      advisor: 'Dr. Shweta Pathak',
      available: 90,
      inCirculation: 12,
      secondaryCount: 8,
      total: 110,
    },
    {
      centerId: 6,
      code: 'CSD',
      name: 'Centre for Social Development',
      advisor: 'Dr. Pradeep Nair',
      available: 98,
      inCirculation: 15,
      secondaryCount: 11,
      total: 124,
    },
    {
      centerId: 7,
      code: 'CFM',
      name: 'Centre for Financial Management',
      advisor: 'Shri Manoj Joshi',
      available: 70,
      inCirculation: 9,
      secondaryCount: 6,
      total: 85,
    },
    {
      centerId: 8,
      code: 'CIET',
      name: 'Centre for Innovation & Tech',
      advisor: 'Dr. Rajesh Patel',
      available: 82,
      inCirculation: 11,
      secondaryCount: 9,
      total: 102,
    },
    {
      centerId: 9,
      code: 'EXT-DEPT',
      name: 'External Dept. Reports (Kisi Bahar ke Dept ki Report)',
      advisor: 'State & Central Ministries',
      available: 245,
      inCirculation: 35,
      secondaryCount: 20,
      total: 300,
    },
  ];

  // 3. Data for OTHER Mode (Motivational Books & Auto-Biographies)
  const otherCenterStats: CenterStatData[] = [
    {
      centerId: 101,
      code: 'MOTIV-CS',
      name: 'Motivational & Civil Services Leadership',
      advisor: 'Inspirational Section',
      available: 165,
      inCirculation: 32,
      secondaryCount: 13,
      total: 210,
    },
    {
      centerId: 102,
      code: 'BIO-STATES',
      name: 'Auto-Biographies & Biographies of Statesmen',
      advisor: 'Memorial Section',
      available: 155,
      inCirculation: 28,
      secondaryCount: 12,
      total: 195,
    },
    {
      centerId: 103,
      code: 'ETHICS-PUB',
      name: 'Public Service Ethics & Administrative Values',
      advisor: 'Governance Ethics',
      available: 125,
      inCirculation: 24,
      secondaryCount: 11,
      total: 160,
    },
    {
      centerId: 104,
      code: 'MEMOIRS',
      name: 'Civil Service Memoirs & Chronicles',
      advisor: 'Heritage Section',
      available: 140,
      inCirculation: 26,
      secondaryCount: 9,
      total: 175,
    },
    {
      centerId: 105,
      code: 'LEADERSHIP',
      name: 'Strategic Leadership & Mindset',
      advisor: 'Leadership Studies',
      available: 130,
      inCirculation: 20,
      secondaryCount: 10,
      total: 160,
    },
    {
      centerId: 106,
      code: 'VISIONARIES',
      name: 'National Builders & Thinkers',
      advisor: 'Visionary Literature',
      available: 125,
      inCirculation: 15,
      secondaryCount: 10,
      total: 150,
    },
  ];

  // 4. Data for NEWSPAPERS & MAGAZINES Mode (Daily Newspapers & Periodical Subscriptions)
  const newspaperStats: CenterStatData[] = [
    {
      centerId: 1,
      code: 'DB-HIN',
      name: 'Dainik Bhaskar (Daily Hindi Newspaper)',
      advisor: 'Bhopal News Agency Pvt Ltd',
      available: 28,
      inCirculation: 2,
      secondaryCount: 0,
      total: 30,
    },
    {
      centerId: 2,
      code: 'TH-ENG',
      name: 'The Hindu (Daily English Newspaper)',
      advisor: 'Central India News Distributors',
      available: 29,
      inCirculation: 1,
      secondaryCount: 0,
      total: 30,
    },
    {
      centerId: 3,
      code: 'HT-ENG',
      name: 'Hindustan Times (Daily English Newspaper)',
      advisor: 'National Periodical Supply Co.',
      available: 27,
      inCirculation: 3,
      secondaryCount: 0,
      total: 30,
    },
    {
      centerId: 7,
      code: 'NBT-HIN',
      name: 'Navbharat Times (Daily Hindi - Renewal Due)',
      advisor: 'Times Group Circulation Division',
      available: 26,
      inCirculation: 1,
      secondaryCount: 3,
      total: 30,
    },
    {
      centerId: 101,
      code: 'IND-TOD',
      name: 'India Today (Weekly News Magazine)',
      advisor: 'Thomson Press India Distribution',
      available: 4,
      inCirculation: 1,
      secondaryCount: 0,
      total: 5,
    },
    {
      centerId: 102,
      code: 'YOJ-MAG',
      name: 'Yojana (Monthly Socio-Economic Journal)',
      advisor: 'Government Publications Sales Depot',
      available: 3,
      inCirculation: 1,
      secondaryCount: 0,
      total: 4,
    },
    {
      centerId: 103,
      code: 'KUR-MAG',
      name: 'Kurukshetra (Monthly Rural Development Journal)',
      advisor: 'Government Publications Sales Depot',
      available: 3,
      inCirculation: 1,
      secondaryCount: 0,
      total: 4,
    },
    {
      centerId: 105,
      code: 'DTE-ENV',
      name: 'Down To Earth (Fortnightly Environment Journal)',
      advisor: 'CSE Circulation Wing, New Delhi',
      available: 2,
      inCirculation: 1,
      secondaryCount: 0,
      total: 3,
    },
    {
      centerId: 104,
      code: 'EPW-WKL',
      name: 'Economic & Political Weekly (Academic Weekly)',
      advisor: 'Academic Book & Periodicals Bureau',
      available: 4,
      inCirculation: 1,
      secondaryCount: 0,
      total: 5,
    },
  ];

  const currentStats =
    dashboardMode === 'BOOKS'
      ? bookCenterStats
      : dashboardMode === 'REPORTS'
        ? reportCenterStats
        : dashboardMode === 'OTHER'
          ? otherCenterStats
          : newspaperStats;

  const maxScale =
    dashboardMode === 'BOOKS'
      ? 800
      : dashboardMode === 'REPORTS'
        ? 400
        : dashboardMode === 'OTHER'
          ? 300
          : 35;

  // Monthly trend data
  const bookTrendData = [
    { month: 'Jan', value: 240 },
    { month: 'Feb', value: 310 },
    { month: 'Mar', value: 420 },
    { month: 'Apr', value: 380 },
    { month: 'May', value: 450 },
    { month: 'Jun', value: 520 },
    { month: 'Jul', value: 490 },
    { month: 'Aug', value: 580 },
    { month: 'Sep', value: 610 },
  ];

  const reportTrendData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 80 },
    { month: 'Mar', value: 115 },
    { month: 'Apr', value: 95 },
    { month: 'May', value: 130 },
    { month: 'Jun', value: 155 },
    { month: 'Jul', value: 140 },
    { month: 'Aug', value: 175 },
    { month: 'Sep', value: 190 },
  ];

  const otherTrendData = [
    { month: 'Jan', value: 50 },
    { month: 'Feb', value: 68 },
    { month: 'Mar', value: 92 },
    { month: 'Apr', value: 84 },
    { month: 'May', value: 105 },
    { month: 'Jun', value: 125 },
    { month: 'Jul', value: 118 },
    { month: 'Aug', value: 138 },
    { month: 'Sep', value: 155 },
  ];

  const newspaperTrendData = [
    { month: 'Jan', value: 178 },
    { month: 'Feb', value: 172 },
    { month: 'Mar', value: 185 },
    { month: 'Apr', value: 182 },
    { month: 'May', value: 190 },
    { month: 'Jun', value: 184 },
    { month: 'Jul', value: 188 },
    { month: 'Aug', value: 192 },
    { month: 'Sep', value: 186 },
  ];

  const currentTrendData =
    dashboardMode === 'BOOKS'
      ? bookTrendData
      : dashboardMode === 'REPORTS'
        ? reportTrendData
        : dashboardMode === 'OTHER'
          ? otherTrendData
          : newspaperTrendData;

  const targetThreshold =
    dashboardMode === 'BOOKS'
      ? 500
      : dashboardMode === 'REPORTS'
        ? 150
        : dashboardMode === 'OTHER'
          ? 160
          : 25;

  // Capacity ranking for bottom left
  const capacityRanked = [...currentStats].sort((a, b) => b.total - a.total).slice(0, 5);

  // Overdue count
  const overdueCount = STATIC_BORROW_RECORDS.filter(b => b.status === 'OVERDUE').length;

  return (
    <Page
      header="Analytics Dashboard"
      subHeader={
        dashboardMode === 'NEWSPAPERS'
          ? 'Daily Newspapers & Periodical Magazines subscription and receipt overview'
          : 'Books, Reports & Circulation overview — 9 AIGGPA Centers'
      }
      headerActions={
        <>
          <Button
            size="small"
            variant="primary"
            icon="plus"
            label="Register Book"
            onClick={() => navigate('/books/add')}
          />
          <Button
            size="small"
            variant="outlined"
            icon="share-alt"
            label="Issue Book"
            onClick={() => navigate('/borrow/issue')}
          />
        </>
      }
    >
      <div className="plain-dashboard">

        {/* Top Control Bar with Quick Actions & Radio Buttons */}
        <div className="dashboard-topbar">
          <div className="topbar-left">

            {/* TOP RADIO BUTTONS: Switch between Books, Reports, Other, and Newspapers */}
            <div className="mode-radio-group">
              <label className={`mode-radio-item ${dashboardMode === 'BOOKS' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="dashboardMode"
                  value="BOOKS"
                  checked={dashboardMode === 'BOOKS'}
                  onChange={() => setDashboardMode('BOOKS')}
                />
                <i className="pi pi-book" />
                <span>Books Analytics</span>
              </label>

              <label className={`mode-radio-item ${dashboardMode === 'REPORTS' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="dashboardMode"
                  value="REPORTS"
                  checked={dashboardMode === 'REPORTS'}
                  onChange={() => setDashboardMode('REPORTS')}
                />
                <i className="pi pi-file-pdf" />
                <span>Reports & Studies</span>
              </label>

              <label className={`mode-radio-item ${dashboardMode === 'OTHER' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="dashboardMode"
                  value="OTHER"
                  checked={dashboardMode === 'OTHER'}
                  onChange={() => setDashboardMode('OTHER')}
                />
                <i className="pi pi-bookmark" />
                <span>Other (Motivational & Bio)</span>
              </label>

              <label className={`mode-radio-item ${dashboardMode === 'NEWSPAPERS' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="dashboardMode"
                  value="NEWSPAPERS"
                  checked={dashboardMode === 'NEWSPAPERS'}
                  onChange={() => setDashboardMode('NEWSPAPERS')}
                />
                <i className="pi pi-calendar" />
                <span>Newspapers & Magazines</span>
              </label>
            </div>
          </div>
        </div>

        {/* 4 Plain KPI Cards (Matching exact labels & with On-Click Navigation to Lists) */}
        <div className="plain-kpi-grid">
          {/* Card 1: Total Book / Report / Other Available */}
          <div
            className="plain-kpi-card clickable"
            onClick={() => {
              if (dashboardMode === 'NEWSPAPERS') navigate('/masters/newspapers');
              else if (dashboardMode === 'OTHER') navigate('/reports/other');
              else navigate('/books');
            }}
            title="Click to view all available cataloged volumes"
          >
            <div className="kpi-top-row">
              <div className="kpi-metric">
                {dashboardMode === 'BOOKS'
                  ? '4,620'
                  : dashboardMode === 'REPORTS'
                    ? '1,120'
                    : dashboardMode === 'OTHER'
                      ? '840'
                      : '9 Active'}
              </div>
              <span className="kpi-click-hint">
                <i className="pi pi-arrow-up-right" />
              </span>
            </div>
            <div className="kpi-label">
              {dashboardMode === 'BOOKS'
                ? 'Total Book Available'
                : dashboardMode === 'REPORTS'
                  ? 'Total Reports Available'
                  : dashboardMode === 'OTHER'
                    ? 'Total Other Books Available'
                    : 'Active Subscriptions'}
            </div>
            <div className="kpi-sub">
              {dashboardMode === 'BOOKS'
                ? 'In-stock across 9 Centers (5,000 Total Stock)'
                : dashboardMode === 'REPORTS'
                  ? 'Center Reports & External Dept. Reports in stock'
                  : dashboardMode === 'OTHER'
                    ? 'Motivational Books & Biographies in library stock'
                    : 'Daily Newspapers (4) & Periodical Magazines (5)'}
            </div>
            <div className="kpi-foot positive">
              <i className="pi pi-list" />{' '}
              {dashboardMode === 'NEWSPAPERS'
                ? 'View Periodicals Master →'
                : 'View Central Catalog List →'}
            </div>
          </div>

          {/* Card 2: Book / Report / Other Issues */}
          <div
            className="plain-kpi-card clickable"
            onClick={() => {
              if (dashboardMode === 'NEWSPAPERS') navigate('/books/add');
              else navigate('/borrow?status=ISSUED');
            }}
            title="Click to view all active issue loan records"
          >
            <div className="kpi-top-row">
              <div className="kpi-metric">
                {dashboardMode === 'BOOKS'
                  ? '380'
                  : dashboardMode === 'REPORTS'
                    ? '120'
                    : dashboardMode === 'OTHER'
                      ? '145'
                      : '186'}
              </div>
              <span className="kpi-click-hint">
                <i className="pi pi-arrow-up-right" />
              </span>
            </div>
            <div className="kpi-label">
              {dashboardMode === 'BOOKS'
                ? 'Book Issues'
                : dashboardMode === 'REPORTS'
                  ? 'Reports Issues'
                  : dashboardMode === 'OTHER'
                    ? 'Other Books Issues'
                    : 'Issues Received (This Month)'}
            </div>
            <div className="kpi-sub">
              {dashboardMode === 'NEWSPAPERS'
                ? 'Daily issues verified & logged via Accession Register'
                : dashboardMode === 'OTHER'
                  ? 'Currently issued to officers, trainees & researchers'
                  : 'Currently issued across departments & research fellows'}
            </div>
            <div className="kpi-foot neutral">
              <i className={dashboardMode === 'NEWSPAPERS' ? 'pi pi-book' : 'pi pi-share-alt'} />{' '}
              {dashboardMode === 'NEWSPAPERS'
                ? 'View Periodical Accession →'
                : 'View Issued Register List →'}
            </div>
          </div>

          {/* Card 3: Within Deadline */}
          <div
            className="plain-kpi-card clickable"
            onClick={() => {
              if (dashboardMode === 'NEWSPAPERS') navigate('/masters/newspapers');
              else navigate('/borrow?status=WITHIN_DEADLINE');
            }}
            title="Click to view borrowings within the 30-day regulation limit"
          >
            <div className="kpi-top-row">
              <div className="kpi-metric">
                {dashboardMode === 'BOOKS'
                  ? '362'
                  : dashboardMode === 'REPORTS'
                    ? '116'
                    : dashboardMode === 'OTHER'
                      ? '139'
                      : '98.2%'}
              </div>
              <span className="kpi-click-hint">
                <i className="pi pi-arrow-up-right" />
              </span>
            </div>
            <div className="kpi-label">
              {dashboardMode === 'NEWSPAPERS' ? 'Delivery Adherence Rate' : 'Within Deadline'}
            </div>
            <div className="kpi-sub">
              {dashboardMode === 'NEWSPAPERS'
                ? 'On-time delivery fulfillment by registered newspaper agencies'
                : 'Loans strictly adhering to standard 30-day borrowing limit'}
            </div>
            <div className="kpi-foot positive">
              <i className="pi pi-check-circle" />{' '}
              {dashboardMode === 'NEWSPAPERS'
                ? 'View Vendor Fulfillment →'
                : 'View Compliant Loans List →'}
            </div>
          </div>

          {/* Card 4: Deadline Exceed */}
          <div
            className="plain-kpi-card clickable overdue-kpi"
            onClick={() => {
              if (dashboardMode === 'NEWSPAPERS') navigate('/masters/newspapers');
              else navigate('/borrow?status=OVERDUE');
            }}
            title="Click to view borrowings exceeding 30-day deadline"
          >
            <div className="kpi-top-row">
              <div className="kpi-metric danger-text">
                {dashboardMode === 'BOOKS'
                  ? `${overdueCount > 0 ? overdueCount : 18}`
                  : dashboardMode === 'REPORTS'
                    ? '4'
                    : dashboardMode === 'OTHER'
                      ? '6'
                      : '2'}
              </div>
              <span className="kpi-click-hint danger-text">
                <i className="pi pi-exclamation-triangle" />
              </span>
            </div>
            <div className="kpi-label danger-text">
              {dashboardMode === 'NEWSPAPERS' ? 'Expiring / Due Renewal' : 'Deadline Exceed'}
            </div>
            <div className="kpi-sub">
              {dashboardMode === 'NEWSPAPERS'
                ? 'Subscriptions requiring annual renewal in FY 2026-27'
                : 'Exceeded mandatory 30-day return limit — recall action needed'}
            </div>
            <div className="kpi-foot warning">
              <i className="pi pi-bell" />{' '}
              {dashboardMode === 'NEWSPAPERS'
                ? 'View Expiring Subscriptions →'
                : 'View Overdue Borrowers List →'}
            </div>
          </div>
        </div>

        {/* Main Stacked Bar Chart (9 Centers & External Depts & Other Collections) */}
        <div className="plain-chart-card main-chart-section">
          <div className="chart-header">
            <div>
              <h3 className="chart-title">
                {dashboardMode === 'BOOKS'
                  ? 'Library Stock & Resource Distribution by 9 Centers'
                  : dashboardMode === 'REPORTS'
                    ? 'AIGGPA Center Reports (9 Centers Table) & External Dept. Reports'
                    : dashboardMode === 'OTHER'
                      ? 'Other Collections: Motivational & Auto-Biographies Collection'
                      : 'Newspapers & Periodical Magazines Circulation & Receipt Adherence'}
              </h3>
              <p className="chart-subtitle">
                {dashboardMode === 'BOOKS'
                  ? 'Center → Subject Specialization → Accession Volumes • click any bar to view list'
                  : dashboardMode === 'REPORTS'
                    ? 'Institutional Projects, Research Monographs & Partner Department Publications'
                    : dashboardMode === 'OTHER'
                      ? 'Leadership, Self-Improvement, Statesmen Biographies & Civil Service Memoirs'
                      : 'Daily Newspapers (Hindi/English) & Periodicals • click any bar to view subscription'}
              </p>
            </div>
            <div className="chart-header-right">
              <span className="division-tag">
                {dashboardMode === 'BOOKS'
                  ? '9 AIGGPA Centers'
                  : dashboardMode === 'REPORTS'
                    ? '9 Centers + External Depts'
                    : dashboardMode === 'OTHER'
                      ? 'Motivational & Biographies'
                      : '9 Active Periodicals'}
              </span>
            </div>
          </div>

          <div className="chart-category-label">
            <span>
              {dashboardMode === 'BOOKS'
                ? 'ALL 9 RESEARCH CENTERS'
                : dashboardMode === 'REPORTS'
                  ? 'CENTERS & EXTERNAL DEPARTMENTS'
                  : dashboardMode === 'OTHER'
                    ? 'SPECIAL COLLECTIONS & MOTIVATIONAL DOMAINS'
                    : 'PERIODICAL TITLES & ADHERENCE LOG'}
            </span>
            <small>Click a bar to inspect collection</small>
          </div>

          {/* Stacked Chart Canvas */}
          <div className="stacked-chart-container">
            {/* Y Axis Scale */}
            <div className="chart-y-axis">
              <span>{maxScale}</span>
              <span>{Math.round(maxScale * 0.75)}</span>
              <span>{Math.round(maxScale * 0.5)}</span>
              <span>{Math.round(maxScale * 0.25)}</span>
              <span>0</span>
            </div>

            {/* Bars Area with Grid Lines */}
            <div className="chart-bars-area">
              <div className="grid-line" style={{ bottom: '100%' }} />
              <div className="grid-line" style={{ bottom: '75%' }} />
              <div className="grid-line" style={{ bottom: '50%' }} />
              <div className="grid-line" style={{ bottom: '25%' }} />
              <div className="grid-line zero-line" style={{ bottom: '0%' }} />

              {/* Bars Track */}
              <div className="bars-track">
                {currentStats.map(stat => {
                  const availableHeight = (stat.available / maxScale) * 100;
                  const inCirculationHeight = (stat.inCirculation / maxScale) * 100;
                  const secondaryHeight = (stat.secondaryCount / maxScale) * 100;
                  const isHovered = hoveredItem?.centerId === stat.centerId;

                  return (
                    <div
                      key={stat.centerId}
                      className={`bar-column-wrapper ${isHovered ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredItem(stat)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={() => {
                        if (dashboardMode === 'NEWSPAPERS') {
                          navigate('/masters/newspapers');
                        } else if (dashboardMode === 'OTHER') {
                          navigate('/reports/other');
                        } else if (stat.code === 'EXT-DEPT') {
                          navigate('/reports/general');
                        } else {
                          navigate(`/books?center=${stat.centerId}`);
                        }
                      }}
                    >
                      {/* Background Column Highlight on Hover (identical to reference Bhopal bar) */}
                      <div className="bar-column-highlight" />

                      {/* Stacked Bar */}
                      <div className="stacked-bar">
                        {/* Top Segment: Light Slate Grey */}
                        <div
                          className="bar-segment reports-segment"
                          style={{ height: `${secondaryHeight}%` }}
                          title={`Secondary: ${stat.secondaryCount}`}
                        />
                        {/* Middle Segment: Bright Cyan */}
                        <div
                          className="bar-segment circulation-segment"
                          style={{ height: `${inCirculationHeight}%` }}
                          title={`Issued: ${stat.inCirculation}`}
                        />
                        {/* Bottom Segment: Deep Navy */}
                        <div
                          className="bar-segment available-segment"
                          style={{ height: `${availableHeight}%` }}
                          title={`Available: ${stat.available}`}
                        />
                      </div>

                      {/* Label under bar */}
                      <span className="bar-x-label">{stat.code}</span>
                    </div>
                  );
                })}
              </div>

              {/* Floating Tooltip matching Reference Screenshot */}
              {hoveredItem && (
                <div className="floating-chart-tooltip">
                  <div className="tooltip-header">{hoveredItem.code}</div>
                  <div className="tooltip-sub">{hoveredItem.name}</div>
                  <div className="tooltip-rows">
                    <div className="tooltip-row">
                      <span className="dot dot-navy" />
                      <span className="row-label">
                        {dashboardMode === 'BOOKS'
                          ? 'Available Books'
                          : dashboardMode === 'REPORTS'
                            ? 'In-Stock Reports'
                            : dashboardMode === 'OTHER'
                              ? 'Available Volumes'
                              : 'Reading Stand (Available)'}
                      </span>
                      <strong className="row-value">{hoveredItem.available}</strong>
                    </div>
                    <div className="tooltip-row">
                      <span className="dot dot-cyan" />
                      <span className="row-label">
                        {dashboardMode === 'BOOKS'
                          ? 'In Circulation'
                          : dashboardMode === 'REPORTS'
                            ? 'In Active Consultation'
                            : dashboardMode === 'OTHER'
                              ? 'In Circulation'
                              : 'In Active Reading / Issued'}
                      </span>
                      <strong className="row-value">{hoveredItem.inCirculation}</strong>
                    </div>
                    <div className="tooltip-row">
                      <span className="dot dot-grey" />
                      <span className="row-label">
                        {dashboardMode === 'BOOKS'
                          ? 'Reports & Studies'
                          : dashboardMode === 'REPORTS'
                            ? 'Whitepapers / Briefs'
                            : dashboardMode === 'OTHER'
                              ? 'Special Reference Copies'
                              : 'Archival / Reference'}
                      </span>
                      <strong className="row-value">{hoveredItem.secondaryCount}</strong>
                    </div>
                    <div className="tooltip-divider" />
                    <div className="tooltip-row total-row">
                      <span>{dashboardMode === 'NEWSPAPERS' ? 'Monthly Issues' : 'Total Volumes'}</span>
                      <strong>{hoveredItem.total}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color dot-navy" />
              <span>
                {dashboardMode === 'BOOKS'
                  ? 'Available Books'
                  : dashboardMode === 'REPORTS'
                    ? 'Available Reports'
                    : dashboardMode === 'OTHER'
                      ? 'Available Volumes'
                      : 'Reading Stand (Available)'}
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-color dot-cyan" />
              <span>
                {dashboardMode === 'BOOKS'
                  ? 'In Circulation'
                  : dashboardMode === 'REPORTS'
                    ? 'In Active Consultation'
                    : dashboardMode === 'OTHER'
                      ? 'In Circulation'
                      : 'In Active Reading'}
              </span>
            </div>
            <div className="legend-item">
              <span className="legend-color dot-grey" />
              <span>
                {dashboardMode === 'BOOKS'
                  ? 'Reports & Studies'
                  : dashboardMode === 'REPORTS'
                    ? 'Monographs / Briefs'
                    : dashboardMode === 'OTHER'
                      ? 'Special Edition Copies'
                      : 'Archival / Past Issues'}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Two Charts (Side by Side matching Reference) */}
        <div className="bottom-charts-grid">
          {/* Bottom Left Card: Capacity Horizontal Bars */}
          <div className="plain-chart-card">
            <div className="chart-header">
              <div>
                <h4 className="card-inner-title">
                  {dashboardMode === 'BOOKS'
                    ? 'Top Centers Capacity — Volume View'
                    : dashboardMode === 'REPORTS'
                      ? 'Top Centers by Report Output'
                      : dashboardMode === 'OTHER'
                        ? 'Top Special Collections Capacity'
                        : 'Top Periodicals by Monthly Volume'}
                </h4>
                <p className="card-inner-sub">
                  {dashboardMode === 'NEWSPAPERS'
                    ? `Sorted by monthly issues received • Target: ${targetThreshold} issues`
                    : `Sorted by volume capacity • Target: ${targetThreshold} volumes`}
                </p>
              </div>
              <select
                className="plain-select"
                value={selectedFilter}
                onChange={e => setSelectedFilter(e.target.value)}
              >
                <option value="All">All Entities</option>
                <option value="High Volume">High Volume (&gt; {targetThreshold})</option>
              </select>
            </div>

            <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
              <span className="pill-tag">
                <i className={dashboardMode === 'NEWSPAPERS' ? 'pi pi-calendar' : 'pi pi-building'} />{' '}
                {dashboardMode === 'BOOKS'
                  ? 'All 9 Centers'
                  : dashboardMode === 'REPORTS'
                    ? 'Centers & Departments'
                    : dashboardMode === 'OTHER'
                      ? 'Motivational & Biographies'
                      : 'Newspapers & Magazines'}
              </span>
            </div>

            {/* Horizontal Bar List */}
            <div className="horizontal-bars-list">
              {capacityRanked.map(center => {
                const maxBar =
                  dashboardMode === 'BOOKS' ? 700 : dashboardMode === 'NEWSPAPERS' ? 35 : 350;
                const percentage = Math.min(100, Math.round((center.total / maxBar) * 100));
                return (
                  <div key={center.centerId} className="h-bar-row">
                    <span className="h-bar-label">{center.code}</span>
                    <div className="h-bar-container">
                      {/* Target reference dashed line */}
                      <div
                        className="target-vertical-line"
                        style={{ left: `${(targetThreshold / maxBar) * 100}%` }}
                      >
                        <span className="target-badge">
                          {targetThreshold} {dashboardMode === 'NEWSPAPERS' ? 'issues' : 'target'}
                        </span>
                      </div>
                      <div
                        className="h-bar-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="h-bar-val">
                      {center.total} {dashboardMode === 'NEWSPAPERS' ? 'issues' : 'vols'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Right Card: Area Trend Chart */}
          <div className="plain-chart-card">
            <div className="chart-header">
              <div>
                <h4 className="card-inner-title">
                  {dashboardMode === 'BOOKS'
                    ? 'Monthly Borrowing & Accession Trend'
                    : dashboardMode === 'REPORTS'
                      ? 'Monthly Reports Intake & Consultation Trend'
                      : dashboardMode === 'OTHER'
                        ? 'Monthly Special Collections Circulation Trend'
                        : 'Monthly Periodicals Receipt & Delivery Trend'}
                </h4>
                <p className="card-inner-sub">
                  {dashboardMode === 'NEWSPAPERS'
                    ? 'Issues delivered per month • dashed = monthly target (180)'
                    : `Volumes per month • dashed = monthly target (${dashboardMode === 'BOOKS' ? '450' : dashboardMode === 'REPORTS' ? '120' : '100'})`}
                </p>
              </div>
              <select className="plain-select">
                <option value="2026">Year 2026</option>
                <option value="2025">Year 2025</option>
              </select>
            </div>

            {/* SVG Area Chart */}
            <div className="svg-trend-container">
              <svg viewBox="0 0 600 240" className="trend-svg">
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.02" />
                  </linearGradient>
                </defs>

                {/* Horizontal reference grid lines */}
                <line x1="40" y1="30" x2="580" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="80" x2="580" y2="80" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="130" x2="580" y2="130" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="40" y1="180" x2="580" y2="180" stroke="#f1f5f9" strokeWidth="1" />

                {/* Y Axis Labels */}
                <text x="10" y="35" className="svg-axis-text">
                  {dashboardMode === 'BOOKS' ? '600' : dashboardMode === 'NEWSPAPERS' ? '240' : '200'}
                </text>
                <text x="10" y="85" className="svg-axis-text">
                  {dashboardMode === 'BOOKS' ? '450' : dashboardMode === 'NEWSPAPERS' ? '180' : '150'}
                </text>
                <text x="10" y="135" className="svg-axis-text">
                  {dashboardMode === 'BOOKS' ? '300' : dashboardMode === 'NEWSPAPERS' ? '120' : '100'}
                </text>
                <text x="10" y="185" className="svg-axis-text">
                  {dashboardMode === 'BOOKS' ? '150' : dashboardMode === 'NEWSPAPERS' ? '60' : '50'}
                </text>

                {/* Target dashed line */}
                <line
                  x1="40"
                  y1="80"
                  x2="580"
                  y2="80"
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                  strokeWidth="1.2"
                />

                {/* Area Gradient Fill */}
                <polygon
                  points="
                    60,175
                    120,150
                    180,105
                    240,120
                    300,95
                    360,70
                    420,80
                    480,45
                    540,30
                    540,200
                    60,200
                  "
                  fill="url(#purpleGradient)"
                />

                {/* Trend Stroke Line */}
                <polyline
                  points="
                    60,175
                    120,150
                    180,105
                    240,120
                    300,95
                    360,70
                    420,80
                    480,45
                    540,30
                  "
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points */}
                {currentTrendData.map((pt, idx) => {
                  const xPositions = [60, 120, 180, 240, 300, 360, 420, 480, 540];
                  const yPositions = [175, 150, 105, 120, 95, 70, 80, 45, 30];
                  const cx = xPositions[idx];
                  const cy = yPositions[idx];

                  return (
                    <g key={idx}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r="4.5"
                        fill="#ffffff"
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                        className="trend-point"
                        onMouseEnter={() => setHoveredPoint({ label: pt.month, value: pt.value })}
                        onMouseLeave={() => setHoveredPoint(null)}
                      />
                      <text x={cx} y="220" textAnchor="middle" className="svg-month-text">
                        {pt.month}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip for trend point */}
              {hoveredPoint && (
                <div className="trend-point-tooltip">
                  <strong>{hoveredPoint.label} 2026</strong>: {hoveredPoint.value}{' '}
                  {dashboardMode === 'NEWSPAPERS' ? 'issues received' : 'volumes'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
