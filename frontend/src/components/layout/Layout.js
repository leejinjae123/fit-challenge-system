import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../styles/global.css';
import '../../styles/layout.css';

const Layout = () => {
  return (
    <div className="layout-container">
      <header className="layout-header">
        <h1 className="layout-title">Fit Challenge</h1>
        <span className="layout-coach-pill">AI Coach</span>
      </header>

      <main className="layout-main">
        <Outlet />
      </main>

      <nav className="layout-nav">
        <NavItem to="/" icon="01" label="운동" />
        <NavItem to="/stats" icon="02" label="분석" />
        <NavItem to="/my" icon="03" label="내 정보" />
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
