import React from 'react';
import '../styles/components.css';

export const Button = ({ children, onClick, variant = 'primary', style }) => {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
      style={style}
      onTouchStart={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onTouchEnd={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, title, style }) => {
  return (
    <div className="card" style={style}>
      {title && <h2 className="card-title" style={{ fontSize: '22px', margin: '0 0 8px 0' }}>{title}</h2>}
      {children}
    </div>
  );
};

export const StatusBox = ({ label, value }) => {
  return (
    <div className="status-box">
      <p style={{ 
        fontSize: '12px', 
        fontWeight: '600', 
        color: 'var(--text-secondary)', 
        margin: '0 0 4px 0', 
        textTransform: 'uppercase' 
      }}>
        {label}
      </p>
      <p style={{ 
        fontSize: '16px', 
        fontWeight: '500', 
        margin: 0 
      }}>
        {value}
      </p>
    </div>
  );
};

