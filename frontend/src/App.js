import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import MyPage from './pages/MyPage';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';

// 인증 및 온보딩 체크 컴포넌트
const AppGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. 로그인 여부 확인 (토큰 존재 여부)
      // const token = localStorage.getItem('accessToken'); // 실제 구현 시 사용
      
      // 2. 온보딩 완료 여부 확인
      const localOnboarded = localStorage.getItem('isOnboarded');
      
      // 로그인/온보딩이 안 되어 있다면 로그인 페이지로 (단, 메인, 회원가입/로그인 페이지는 제외)
      if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/onboarding') {
        setIsChecking(false);
        return;
      }

      if (localOnboarded === 'true') {
        setIsChecking(false);
      } else {
        // 온보딩 기록이 없으면 로그인 화면으로 보냄
        navigate('/login');
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate, location]);

  if (isChecking) {
    return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AppGuard>
        <Routes>
          {/* 로그인 & 회원가입(온보딩) */}
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* 메인 앱 (Layout 적용) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="stats" element={<Stats />} />
            <Route path="my" element={<MyPage />} />
          </Route>
        </Routes>
      </AppGuard>
    </BrowserRouter>
  );
}

export default App;
