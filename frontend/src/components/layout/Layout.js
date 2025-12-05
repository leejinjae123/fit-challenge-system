import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../styles/global.css';
import '../../styles/layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      {/* Header - Fixed Top */}
      <header className="layout-header">
        <h1 className="layout-title">Fitness Challenge</h1>
      </header>

      {/* Main Content - Scrollable Area */}
      {/* Outlet renders the current page content */}
      <main className="layout-main">
        <Outlet />
      </main>

      {/* Bottom Navigation - Fixed Bottom */}
      <nav className="layout-nav">
        <NavItem to="/" icon="🏠" label="Home" />
        <NavItem to="/stats" icon="📊" label="Stats" />
        <NavItem to="/my" icon="👤" label="My" />
      </nav>
    </div>
  );
};

const NavItem = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to} className={`layout-nav-item ${isActive ? 'active' : ''}`}>
      <span className="layout-nav-icon">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

export default Layout;
