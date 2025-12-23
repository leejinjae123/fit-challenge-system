import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/Common';
import ChallengeService from '../services/ChallengeService';
import AuthService from '../services/AuthService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Stats = () => {
  const [workouts, setWorkouts] = useState([]);
  const [weight, setWeight] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getMyInfo();
      setUserId(user.id);
      const data = await ChallengeService.getUserWorkouts(user.id);
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight) return alert('몸무게를 입력해주세요.');

    try {
      await ChallengeService.saveUserWorkout({
        weight: parseFloat(weight),
        memo,
      }, userId);
      alert('기록되었습니다!');
      setWeight('');
      setMemo('');
      loadData();
    } catch (error) {
      alert('저장 실패');
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '200px' }}>데이터 로딩 중...</div>;

  return (
    <div style={{ paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>운동 통계 및 기록</h2>

      {/* 1. 몸무게 및 성공률 그래프 */}
      <Card title="변화 추이" style={{ marginBottom: '20px' }}>
        {workouts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px 0', color: '#9CA3AF' }}>기록된 데이터가 없습니다.</p>
        ) : (
          <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            <ResponsiveContainer>
              <LineChart data={workouts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="createdAt" 
                  tick={{ fontSize: 12 }} 
                  tickFormatter={(val) => val.substring(5)} // MM-DD만 표기
                />
                <YAxis yAxisId="left" orientation="left" stroke="#4F46E5" tick={{ fontSize: 12 }} domain={['dataMin - 5', 'dataMax + 5']} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="weight" 
                  name="몸무게 (kg)" 
                  stroke="#4F46E5" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="successRate" 
                  name="성공률 (%)" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {/* 2. 오늘 기록 등록 */}
      <Card title="오늘의 기록 등록" style={{ marginBottom: '20px' }}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>오늘의 몸무게 (kg)</label>
            <input 
              type="number" 
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="예: 75.5"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>운동 메모</label>
            <textarea 
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="오늘 운동은 어땠나요?"
              style={{ ...styles.input, height: '80px', resize: 'none' }}
            />
          </div>
          <p style={styles.infoText}>
            * 성공률은 오늘 '계획됨' 상태인 운동 중 '완료'된 비율로 자동 계산됩니다.
          </p>
          <Button type="submit" variant="primary" style={{ width: '100%' }}>
            기록하기
          </Button>
        </form>
      </Card>

      {/* 3. 최근 메모 리스트 */}
      <Card title="최근 메모">
        {workouts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px 0', color: '#9CA3AF' }}>메모가 없습니다.</p>
        ) : (
          <div style={styles.memoList}>
            {workouts.slice().reverse().map(w => (
              <div key={w.id} style={styles.memoItem}>
                <div style={styles.memoHeader}>
                  <span style={styles.memoDate}>{w.createdAt}</span>
                  <span style={styles.memoWeight}>{w.weight}kg</span>
                </div>
                <p style={styles.memoContent}>{w.memo || '메모 없음'}</p>
                <div style={styles.memoRate}>성공률: {Math.round(w.successRate)}%</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    fontSize: '15px',
    outline: 'none',
  },
  infoText: {
    fontSize: '12px',
    color: '#6B7280',
    margin: '0 0 8px 0',
  },
  memoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
  },
  memoItem: {
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px',
    border: '1px solid #F3F4F6',
  },
  memoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  memoDate: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: '#4B5563',
  },
  memoWeight: {
    fontSize: '13px',
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  memoContent: {
    fontSize: '14px',
    margin: '0 0 8px 0',
    lineHeight: '1.4',
    color: '#1F2937',
  },
  memoRate: {
    fontSize: '12px',
    color: '#10B981',
    fontWeight: '600',
  }
};

export default Stats;
