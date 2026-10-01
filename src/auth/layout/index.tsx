import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import Header from './Header';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

function useIsMobile(breakpoint = 992) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

export default function AppLayout({ children }: React.PropsWithChildren) {
  const isMobile = useIsMobile(992);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarMode, setIsSidebarMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('app-sidebar-mode');
    return saved !== null ? saved === 'true' : true;
  });

  const toggleMenu = () => {
    if (isMobile) {
      setIsMenuOpen(prev => !prev);
    } else {
      setIsSidebarMode(prev => {
        const next = !prev;
        localStorage.setItem('app-sidebar-mode', String(next));
        return next;
      });
    }
  };

  return (
    <div
      className={`app-layout ${isSidebarMode && !isMobile ? 'sidebar-open' : ''}`}
    >
      <Sidebar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isMobile={isMobile}
        isSidebarMode={isSidebarMode}
      />
      <div className="main-layout">
        <Header
          toggleMenu={toggleMenu}
          isMenuOpen={isMenuOpen}
          isSidebarMode={isSidebarMode}
        />
        <Navbar isSidebarMode={isSidebarMode && !isMobile} />
        <main className="main-content" style={{ padding: '1rem 1.25rem 2rem 1.25rem' }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
