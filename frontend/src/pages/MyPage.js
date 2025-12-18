import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/Common';
import AuthService from '../services/AuthService';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const data = await AuthService.getMyInfo();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchMyInfo();
  }, []);

  const handleLogout = () => {
    // 모든 로컬 저장소 데이터 초기화
    localStorage.clear();
    sessionStorage.clear();
    
    // 상태 초기화
    setUserInfo(null);

    // 페이지를 새로고침하며 로그인 페이지로 이동 (메모리상 상태 완전 초기화)
    window.location.replace('/login');
  };

  const getLevelLabel = (code) => {
    switch(code) {
      case 'L10': return '초급';
      case 'L20': return '중급';
      case 'L30': return '고급';
      default: return '미설정';
    }
  };

  if (!userInfo) return <div>Loading...</div>;

  return (
    <div style={{ paddingBottom: '20px' }}>
      <Card title="내 프로필" style={{ marginBottom: '20px' }}>
        <div style={styles.profileHeader}>
          <div style={styles.avatar}>👤</div>
          <h3 style={styles.nickname}>{userInfo.nickname}</h3>
          <p style={styles.email}>{userInfo.email}</p>
        </div>
      </Card>

      <Card title="신체 정보">
        <div style={styles.metricsGrid}>
          <MetricItem label="키" value={`${userInfo.height} cm`} />
          <MetricItem label="몸무게" value={`${userInfo.weight} kg`} />
          <MetricItem label="운동 레벨" value={getLevelLabel(userInfo.levelCode)} />
          <MetricItem label="주간 목표" value={`${userInfo.weeklyGoal} 회`} />
        </div>
      </Card>

      <div style={{ marginTop: '20px' }}>
        <Button variant="secondary" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </div>
  );
};

const MetricItem = ({ label, value }) => (
  <div style={styles.metricItem}>
    <span style={styles.metricLabel}>{label}</span>
    <span style={styles.metricValue}>{value}</span>
  </div>
);

const styles = {
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  },
  avatar: {
    fontSize: '48px',
    marginBottom: '10px',
    backgroundColor: '#F3F4F6',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nickname: {
    fontSize: '20px',
    fontWeight: '700',
    margin: '0 0 4px 0',
  },
  email: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    width: '100%',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '4px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--primary-color)',
  }
};

export default MyPage;
