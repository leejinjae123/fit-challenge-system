import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/Common';
import AuthService from '../services/AuthService';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickname: '',
    height: '',
    weight: '',
    levelCode: '',
    weeklyGoal: ''
  });

  const fetchMyInfo = async () => {
    try {
      const data = await AuthService.getMyInfo();
      setUserInfo(data);
      setEditForm({
        nickname: data.nickname,
        height: data.height,
        weight: data.weight,
        levelCode: data.levelCode,
        weeklyGoal: data.weeklyGoal
      });
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  useEffect(() => {
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && userInfo) {
      setEditForm({
        nickname: userInfo.nickname,
        height: userInfo.height,
        weight: userInfo.weight,
        levelCode: userInfo.levelCode,
        weeklyGoal: userInfo.weeklyGoal
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AuthService.updateMyInfo(editForm);
      await fetchMyInfo();
      setIsEditing(false);
      alert('정보가 수정되었습니다.');
    } catch (error) {
      console.error('Failed to update info:', error);
      alert('정보 수정에 실패했습니다.');
    }
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
        {isEditing ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={editForm.nickname}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>키 (cm)</label>
              <input
                type="number"
                name="height"
                value={editForm.height}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>몸무게 (kg)</label>
              <input
                type="number"
                name="weight"
                value={editForm.weight}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>운동 레벨</label>
              <select
                name="levelCode"
                value={editForm.levelCode}
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="L10">초급</option>
                <option value="L20">중급</option>
                <option value="L30">고급</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>주간 목표 (회)</label>
              <input
                type="number"
                name="weeklyGoal"
                value={editForm.weeklyGoal}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.buttonGroup}>
              <Button type="submit" variant="primary" style={{ flex: 1 }}>저장</Button>
              <Button type="button" variant="secondary" onClick={handleEditToggle} style={{ flex: 1, marginLeft: '10px' }}>취소</Button>
            </div>
          </form>
        ) : (
          <>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>👤</div>
              <h3 style={styles.nickname}>{userInfo.nickname}</h3>
              <p style={styles.email}>{userInfo.email}</p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <Button variant="outline" onClick={handleEditToggle} style={{ padding: '4px 12px', fontSize: '14px' }}>
                수정하기
              </Button>
            </div>
          </>
        )}
      </Card>

      {!isEditing && (
        <Card title="신체 정보">
          <div style={styles.metricsGrid}>
            <MetricItem label="키" value={`${userInfo.height} cm`} />
            <MetricItem label="몸무게" value={`${userInfo.weight} kg`} />
            <MetricItem label="운동 레벨" value={getLevelLabel(userInfo.levelCode)} />
            <MetricItem label="주간 목표" value={`${userInfo.weeklyGoal} 회`} />
          </div>
        </Card>
      )}

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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '16px',
  },
  buttonGroup: {
    display: 'flex',
    marginTop: '10px',
  }
};

export default MyPage;
