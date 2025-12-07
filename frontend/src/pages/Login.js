import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import AuthService from '../services/AuthService';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError('');
    try {
      await AuthService.login(credentials.email, credentials.password);
      alert('로그인 성공!');
      navigate('/');
    } catch (err) {
      console.error('Login failed', err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1 className="app-title">Fit Challenge</h1>
        <p className="app-subtitle">AI 홈트레이닝 & 챌린지</p>
      </div>

      <div className="login-form">
        <input 
          type="email" 
          name="email"
          className="text-input"
          placeholder="이메일"
          value={credentials.email}
          onChange={handleChange}
        />
        <input 
          type="password" 
          name="password"
          className="text-input"
          placeholder="비밀번호"
          value={credentials.password}
          onChange={handleChange}
        />
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <Button onClick={handleLogin} style={{ marginTop: '20px' }}>
          로그인
        </Button>
      </div>

      <div className="login-footer">
        <p>계정이 없으신가요?</p>
        <button className="link-btn" onClick={() => navigate('/onboarding')}>
          회원가입 및 온보딩 시작
        </button>
      </div>
    </div>
  );
};

export default Login;
