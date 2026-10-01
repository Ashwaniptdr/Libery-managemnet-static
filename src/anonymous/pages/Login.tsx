import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { DEMO_USERS, login, type AuthUser } from '../../shared/utils/auth';
import {
  COLOR_THEMES,
  getActiveTheme,
  setActiveTheme,
  type ColorThemeId,
} from '../../shared/utils/theme';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();

  // Selected Demo User
  const [selectedUserKey, setSelectedUserKey] = useState<keyof typeof DEMO_USERS>('neeta');
  const [username, setUsername] = useState(DEMO_USERS.neeta.email);
  const [password, setPassword] = useState('Library@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Theme states for topbar
  const [activeTheme, setActiveThemeState] = useState<ColorThemeId>(() => getActiveTheme());
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('app-theme') === 'dark';
  });

  const toggleThemeMode = () => {
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

  const handleSelectColorTheme = (themeId: ColorThemeId) => {
    setActiveTheme(themeId);
    setActiveThemeState(themeId);
    setIsThemeOpen(false);
  };

  const handlePresetSelect = (key: keyof typeof DEMO_USERS, user: AuthUser) => {
    setSelectedUserKey(key);
    setUsername(user.email);
    setPassword('Library@2026');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentUser = DEMO_USERS[selectedUserKey] || DEMO_USERS.neeta;

    setTimeout(() => {
      login(currentUser);
      setIsLoading(false);
      navigate('/');
    }, 550);
  };

  return (
    <div className="login-wrapper">
      {/* Top Navbar */}
      <header className="login-topbar">
        <div className="login-topbar-brand">
          <img
            src="/assets/images/aiggpa_seal.jpg"
            alt="AIGGPA Seal"
            className="login-topbar-seal"
          />
          <div className="login-topbar-titles">
            <h1>AIGGPA Library & Publications Portal</h1>
            <p>Atal Bihari Vajpayee Institute of Good Governance and Policy Analysis</p>
          </div>
        </div>

        <div className="login-topbar-actions">
          {/* 5-Theme Switcher Button on Login Page */}
          <div className="theme-selector-wrapper">
            <button
              type="button"
              className={`toggle-btn theme-toggle-btn ${isThemeOpen ? 'active' : ''}`}
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              title="Select Color Theme"
              style={{
                color: 'var(--text-primary)',
                background: 'var(--main-content-bg)',
                borderColor: 'var(--border-color)',
              }}
            >
              <i className="pi pi-palette" />
              <span className="theme-active-dot" />
            </button>

            {isThemeOpen && (
              <div className="theme-dropdown" style={{ top: 'calc(100% + 10px)' }}>
                <div className="theme-dropdown-header">
                  <h4>
                    <i className="pi pi-palette" /> Choose Theme
                  </h4>
                  <p>Changes theme across entire system</p>
                </div>
                <div className="theme-dropdown-list">
                  {COLOR_THEMES.map(th => {
                    const isSelected = activeTheme === th.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        className={`theme-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectColorTheme(th.id)}
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

          {/* Dark Mode Toggle */}
          <button
            type="button"
            className="toggle-btn"
            onClick={toggleThemeMode}
            title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            style={{
              color: 'var(--text-primary)',
              background: 'var(--main-content-bg)',
              borderColor: 'var(--border-color)',
            }}
          >
            <i className={isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="login-content-area">
        <div className="login-split-card">
          {/* Left Pane: Visual Hero */}
          <div className="login-hero-pane">
            <img
              src="/assets/images/aiggpa_library_hero.jpg"
              alt="AIGGPA Research Library"
              className="login-hero-bg"
            />
            <div className="login-hero-overlay" />

            <div className="login-hero-top">
              <div className="login-hero-badge">
                <i className="pi pi-verified" /> AIGGPA Knowledge Repository
              </div>
              <h2 className="login-hero-title">
                Integrated Library & Publications Access Portal
              </h2>
              <p className="login-hero-desc">
                Centralized accession, specialized monograph registry, and annual physical audit
                for the 9 Research Centers of Good Governance & Policy Analysis.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="login-hero-stats">
              <div className="login-stat-pill">
                <span className="num">5,120</span>
                <span className="label">Total Volumes</span>
              </div>
              <div className="login-stat-pill">
                <span className="num">9</span>
                <span className="label">Research Centers</span>
              </div>
              <div className="login-stat-pill">
                <span className="num">30 Days</span>
                <span className="label">Circulation Limit</span>
              </div>
            </div>

            <p className="login-hero-quote">
              "Research and policy documentation are the pillars of enlightened governance."
            </p>
          </div>

          {/* Right Pane: Login Form */}
          <div className="login-form-pane">
            <div className="login-form-header">
              <h2>Officer Authentication</h2>
              <p>Sign in with your institute email to access library records</p>
            </div>

            {/* Demo User Selection for 1-Click Convenience */}
            <div className="login-preset-selector">
              <div className="login-preset-label">Quick Sign-In Presets</div>
              <div className="login-preset-buttons">
                {Object.entries(DEMO_USERS).map(([key, u]) => (
                  <button
                    key={key}
                    type="button"
                    className={`preset-btn ${selectedUserKey === key ? 'active' : ''}`}
                    onClick={() => handlePresetSelect(key as keyof typeof DEMO_USERS, u)}
                  >
                    <span className="preset-avatar">{u.avatarText}</span>
                    <span>{u.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-input-group">
                <label htmlFor="login-username">Official Institute Email</label>
                <div className="login-input-wrapper">
                  <i className="pi pi-envelope login-input-icon" />
                  <input
                    id="login-username"
                    type="email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                    placeholder="officer@aiggpa.gov.in"
                    className="login-input-field"
                  />
                </div>
              </div>

              <div className="login-input-group">
                <label htmlFor="login-password">Access Password</label>
                <div className="login-input-wrapper">
                  <i className="pi pi-lock login-input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                    className="login-input-field"
                  />
                  <button
                    type="button"
                    className="login-pwd-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'} />
                  </button>
                </div>
              </div>

              <div className="login-row-options">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <span>Remember session for 30 days</span>
                </label>
                <span className="login-forgot-link" onClick={() => alert('Password reset requested. Please contact Central Library IT Desk.')}>
                  Forgot Password?
                </span>
              </div>

              <button type="submit" className="login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <i className="pi pi-spin pi-spinner" /> Authenticating...
                  </>
                ) : (
                  <>
                    <i className="pi pi-sign-in" /> Sign In to Library Portal
                  </>
                )}
              </button>
            </form>

            <div className="login-security-notice">
              <i className="pi pi-shield" />
              <span>Authorized personnel only • AIGGPA Intranet Security</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        Atal Bihari Vajpayee Institute of Good Governance and Policy Analysis (AIGGPA),
        Bhadbhada Road, Bhopal - 462003, Madhya Pradesh
      </footer>
    </div>
  );
}
