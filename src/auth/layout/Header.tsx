import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Dialog } from 'primereact/dialog';
import Button from '../../shared/components/buttons/Button';
import { getCurrentUser, logout } from '../../shared/utils/auth';
import {
  COLOR_THEMES,
  getActiveTheme,
  setActiveTheme,
  type ColorThemeId,
} from '../../shared/utils/theme';
import './Header.css';

interface HeaderProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
  isSidebarMode: boolean;
}

export default function Header({ toggleMenu }: HeaderProps) {
  const navigate = useNavigate();
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [currentUser] = useState(() => getCurrentUser());
  const [activeTheme, setActiveThemeState] = useState<ColorThemeId>(() => getActiveTheme());
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDark = localStorage.getItem('app-theme') === 'dark';
    if (isDark) {
      document.body.classList.add('dark-theme');
    }
    return isDark;
  });

  const toggleTheme = () => {
    const next = !isDarkTheme;
    setIsDarkTheme(next);
    if (next) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('app-theme', 'light');
    }
  };

  const handleSelectTheme = (themeId: ColorThemeId) => {
    setActiveTheme(themeId);
    setActiveThemeState(themeId);
    setIsThemeMenuOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isThemeMenuOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThemeMenuOpen, isProfileMenuOpen]);

  return (
    <header className="header no-print">
      <div className="header-logo" onClick={() => navigate('/')}>
        <button
          className="sidebar-toggle-btn"
          onClick={e => {
            e.stopPropagation();
            toggleMenu();
          }}
          title="Toggle Navigation Menu"
        >
          <i className="pi pi-bars" />
        </button>

        <div className="header-logo-icon">
          <img
            src="/assets/images/logo.png"
            alt="AIGGPA Logo"
            className="header-logo-img"
          />
        </div>

        <div className="header-logo-text">
          <h3>AIGGPA Library & Publications</h3>
          <p>Atal Bihari Vajpayee Institute of Good Governance and Policy Analysis</p>
        </div>
      </div>

      <div className="header-actions">
        {/* 5-Theme Color Selector Dropdown - High Visibility */}
        <div className="theme-selector-wrapper" ref={themeMenuRef}>
          <button
            className={`header-theme-btn ${isThemeMenuOpen ? 'active' : ''}`}
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            title="Choose Portal Color Theme (5 Themes Available)"
            aria-label="Theme Selector"
          >
            <div className="theme-palette-icon-box">
              <i className="pi pi-palette" />
            </div>
            <div className="theme-btn-text">
              <span className="theme-btn-title">Theme</span>
              <span className="theme-btn-current">
                {COLOR_THEMES.find(t => t.id === activeTheme)?.name.split(' ')[0] || 'Mahogany'}
              </span>
            </div>
            <div className="theme-swatch-dots" aria-hidden="true">
              <span style={{ backgroundColor: '#4a3728' }} />
              <span style={{ backgroundColor: '#1b4332' }} />
              <span style={{ backgroundColor: '#1e3a8a' }} />
              <span style={{ backgroundColor: '#ea580c' }} />
            </div>
            <i className="pi pi-chevron-down theme-dropdown-arrow" />
          </button>

          {isThemeMenuOpen && (
            <div className="theme-dropdown">
              <div className="theme-dropdown-header">
                <h4>
                  <i className="pi pi-palette" /> System Color Theme
                </h4>
                <p>Select from 5 color schemes applied across entire system</p>
              </div>

              <div className="theme-dropdown-list">
                {COLOR_THEMES.map(th => {
                  const isSelected = activeTheme === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      className={`theme-option-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleSelectTheme(th.id)}
                    >
                      <div className="theme-option-left">
                        <div
                          className="theme-swatch-circle"
                          style={{
                            background: `linear-gradient(135deg, ${th.primaryColor} 50%, ${th.secondaryColor} 50%)`,
                          }}
                        />
                        <div className="theme-option-info">
                          <span className="theme-option-name">{th.name}</span>
                          <span className="theme-option-tag">{th.tag}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <span className="theme-option-check">
                          <i className="pi pi-check" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          className="toggle-btn"
          onClick={toggleTheme}
          title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          <i className={isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'} />
        </button>

        {/* User Profile Badge & Dropdown */}
        <div className="user-profile-wrapper" ref={profileMenuRef}>
          <button
            type="button"
            className={`user-badge-btn ${isProfileMenuOpen ? 'active' : ''}`}
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            title="User Profile & Settings"
            aria-expanded={isProfileMenuOpen}
          >
            <div className="user-avatar-circle">{currentUser.avatarText}</div>
            <div className="user-details">
              <span className="name">{currentUser.name}</span>
              <span className="role">{currentUser.role}</span>
            </div>
            <i className={`pi pi-chevron-down user-badge-chevron ${isProfileMenuOpen ? 'open' : ''}`} />
          </button>

          {/* Profile Dropdown Menu matching user reference */}
          {isProfileMenuOpen && (
            <div className="profile-dropdown-menu">
              <button
                type="button"
                className="profile-dropdown-item"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setShowProfileDialog(true);
                }}
              >
                <i className="pi pi-user" />
                <span>Profile</span>
              </button>

              <div className="profile-dropdown-divider" />

              <button
                type="button"
                className="profile-dropdown-item logout-item"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  handleLogout();
                }}
              >
                <i className="pi pi-sign-out" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Dialog */}
      <Dialog
        visible={showProfileDialog}
        onHide={() => setShowProfileDialog(false)}
        header="Officer Profile"
        style={{ width: '440px', maxWidth: '95vw' }}
        modal
        dismissableMask
        className="profile-dialog-box"
      >
        <div className="profile-dialog-content">
          <div className="profile-dialog-top">
            <div className="profile-dialog-avatar">{currentUser.avatarText}</div>
            <h3 className="profile-dialog-name">{currentUser.name}</h3>
            <span className="profile-dialog-role">{currentUser.role}</span>
          </div>

          <div className="profile-info-card">
            <div className="profile-field-row">
              <span className="profile-field-label">
                <i className="pi pi-building" /> Center / Unit:
              </span>
              <span className="profile-field-value">
                {currentUser.center || 'Centre for Public Policy & Governance (CPPG)'}
              </span>
            </div>

            <div className="profile-field-row">
              <span className="profile-field-label">
                <i className="pi pi-envelope" /> Official Email:
              </span>
              <span className="profile-field-value">{currentUser.email}</span>
            </div>

            <div className="profile-field-row">
              <span className="profile-field-label">
                <i className="pi pi-id-card" /> Employee ID:
              </span>
              <span className="profile-field-value">AIGGPA-2026-ADV-09</span>
            </div>

            <div className="profile-field-row">
              <span className="profile-field-label">
                <i className="pi pi-shield" /> Portal Access:
              </span>
              <span className="profile-field-badge">Authorized Center Advisor</span>
            </div>
          </div>

          <div className="profile-dialog-actions">
            <Button
              variant="outlined"
              label="Close"
              onClick={() => setShowProfileDialog(false)}
            />
            <Button
              variant="danger"
              icon="sign-out"
              label="Sign Out"
              onClick={() => {
                setShowProfileDialog(false);
                handleLogout();
              }}
            />
          </div>
        </div>
      </Dialog>
    </header>
  );
}
