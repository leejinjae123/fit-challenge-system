import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import AuthService from '../services/AuthService';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setError('');
    try {
      await AuthService.login(credentials.email, credentials.password);
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
        <p className="app-subtitle">AI 루틴 추천과 운동 기록을 한 화면에서 관리하세요.</p>
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
        {error && <p style={styles.errorText}>{error}</p>}

        <Button onClick={handleLogin} style={{ marginTop: '10px' }}>
          로그인
        </Button>
      </div>

      <div className="login-footer">
        <p style={{ margin: '0 0 8px' }}>처음이라면</p>
        <button className="link-btn" onClick={() => navigate('/onboarding')}>
          프로필 만들기
        </button>
      </div>
    </div>
  );
};

const styles = {
  errorText: {
    margin: '0',
    color: '#ff7b7b',
    fontSize: '13px',
    fontWeight: '700',
  }
};

export default Login;
