import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Stats from './pages/Stats';
import MyPage from './pages/MyPage';
import Onboarding from './pages/Onboarding';

// 온보딩 체크 및 리다이렉트 컴포넌트
const AppGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 로컬 스토리지에서 온보딩 완료 여부 확인
    const isOnboarded = localStorage.getItem('isOnboarded');
    
    // 온보딩이 안 되어있고, 현재 페이지가 온보딩이 아니라면 -> 온보딩 페이지로 이동
    if (!isOnboarded && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [navigate, location]);

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AppGuard>
        <Routes>
          {/* 온보딩 페이지 (Layout 없음, 전체 화면) */}
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
