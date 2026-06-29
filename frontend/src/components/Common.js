import React from 'react';
import '../styles/components.css';

export const Button = ({ children, onClick, variant = 'primary', style, ...props }) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, title, style }) => {
  return (
    <div className="card" style={style}>
      {title && <h2 className="card-title">{title}</h2>}
      {children}
    </div>
  );
};

export const StatusBox = ({ label, value }) => {
  return (
    <div className="status-box">
      <p style={{
        fontSize: '12px',
        fontWeight: '700',
        color: 'var(--text-secondary)',
        margin: '0 0 4px',
        textTransform: 'uppercase'
      }}>
        {label}
      </p>
      <p style={{
        fontSize: '18px',
        fontWeight: '800',
        margin: 0,
        color: 'var(--text-primary)'
      }}>
        {value}
      </p>
    </div>
  );
};
