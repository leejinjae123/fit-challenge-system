import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import '../styles/login.css';
// import AuthService from '../services/AuthService'; // 나중에 구현

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    // TODO: 실제 로그인 API 연동
    console.log('Login attempt:', credentials);
    // 임시: 로그인 성공 처리
    localStorage.setItem('accessToken', 'dummy-token');
    localStorage.setItem('isOnboarded', 'true'); // 이미 가입된 유저라고 가정
    navigate('/');
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

