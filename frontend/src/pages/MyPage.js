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
    localStorage.clear();
    sessionStorage.clear();
    setUserInfo(null);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await AuthService.updateMyInfo(editForm);
      await fetchMyInfo();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update info:', error);
      alert('정보 수정에 실패했습니다.');
    }
  };

  if (!userInfo) {
    return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div>
        <p style={styles.kicker}>프로필</p>
        <h2 style={styles.title}>내 정보</h2>
      </div>

      <Card title="프로필">
        {isEditing ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <FormField label="닉네임" name="nickname" value={editForm.nickname} onChange={handleChange} />
            <FormField label="키(cm)" type="number" name="height" value={editForm.height} onChange={handleChange} />
            <FormField label="몸무게(kg)" type="number" name="weight" value={editForm.weight} onChange={handleChange} />

            <label style={styles.formGroup}>
              <span style={styles.label}>운동 레벨</span>
              <select name="levelCode" value={editForm.levelCode} onChange={handleChange} className="text-input" required>
                <option value="L10">초급</option>
                <option value="L20">중급</option>
                <option value="L30">상급</option>
              </select>
            </label>

            <FormField label="주간 목표(회)" type="number" name="weeklyGoal" value={editForm.weeklyGoal} onChange={handleChange} />

            <div style={styles.buttonGroup}>
              <Button type="submit">저장</Button>
              <Button type="button" variant="secondary" onClick={handleEditToggle}>취소</Button>
            </div>
          </form>
        ) : (
          <>
            <div style={styles.profileHeader}>
              <div style={styles.avatar}>{(userInfo.nickname || 'F').slice(0, 1).toUpperCase()}</div>
              <h3 style={styles.nickname}>{userInfo.nickname}</h3>
              <p style={styles.email}>{userInfo.email}</p>
            </div>
            <Button variant="outline" onClick={handleEditToggle}>정보 수정</Button>
          </>
        )}
      </Card>

      {!isEditing && (
        <Card title="신체 정보">
          <div style={styles.metricsGrid}>
            <MetricItem label="키" value={`${userInfo.height} cm`} />
            <MetricItem label="몸무게" value={`${userInfo.weight} kg`} />
            <MetricItem label="레벨" value={getLevelLabel(userInfo.levelCode)} />
            <MetricItem label="주간 목표" value={`${userInfo.weeklyGoal}회`} />
            <MetricItem label="포인트" value={`${userInfo.points || 0}P`} />
          </div>
        </Card>
      )}

      <Button variant="secondary" onClick={handleLogout}>로그아웃</Button>
    </div>
  );
};

const FormField = ({ label, type = 'text', name, value, onChange }) => (
  <label style={styles.formGroup}>
    <span style={styles.label}>{label}</span>
    <input type={type} name={name} value={value} onChange={onChange} className="text-input" required />
  </label>
);

const MetricItem = ({ label, value }) => (
  <div style={styles.metricItem}>
    <span style={styles.metricLabel}>{label}</span>
    <span style={styles.metricValue}>{value}</span>
  </div>
);

const getLevelLabel = (code) => {
  switch (code) {
    case 'L10': return '초급';
    case 'L20': return '중급';
    case 'L30': return '상급';
    default: return '미설정';
  }
};

const styles = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  kicker: {
    color: 'var(--primary-color)',
    margin: '0 0 6px',
    fontSize: '13px',
    fontWeight: '900',
  },
  title: {
    margin: 0,
    fontSize: '25px',
    fontWeight: '900',
  },
  profileHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '16px',
  },
  avatar: {
    width: '78px',
    height: '78px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    background: 'linear-gradient(145deg, rgba(37, 230, 200, 0.9), rgba(37, 230, 200, 0.22))',
    color: '#061310',
    fontSize: '28px',
    fontWeight: '900',
  },
  nickname: {
    fontSize: '20px',
    fontWeight: '900',
    margin: '0 0 4px',
  },
  email: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    margin: 0,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  metricItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    padding: '13px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    fontWeight: '800',
  },
  metricValue: {
    fontSize: '17px',
    fontWeight: '900',
    color: 'var(--primary-color)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '13px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
  },
  buttonGroup: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '6px',
  }
};

export default MyPage;
