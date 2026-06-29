import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/Common';
import ChallengeService from '../services/ChallengeService';
import AuthService from '../services/AuthService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!weight) {
      alert('몸무게를 입력해주세요.');
      return;
    }

    try {
      await ChallengeService.saveUserWorkout({ weight: parseFloat(weight), memo }, userId);
      setWeight('');
      setMemo('');
      loadData();
    } catch (error) {
      alert('저장에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '200px', color: 'var(--text-secondary)' }}>데이터 로딩 중...</div>;
  }

  const today = new Date().toISOString().split('T')[0];
  const isRecordedToday = workouts.some(workout => workout.createdAt === today);

  return (
    <div style={styles.page}>
      <div>
        <p style={styles.kicker}>분석</p>
        <h2 style={styles.title}>운동 기록</h2>
      </div>

      <Card title="변화 추이">
        {workouts.length === 0 ? (
          <p style={styles.emptyText}>아직 기록된 데이터가 없습니다.</p>
        ) : (
          <div style={styles.chart}>
            <ResponsiveContainer>
              <LineChart data={workouts}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="createdAt" tick={{ fontSize: 12, fill: '#a9afba' }} tickFormatter={(value) => value.substring(5)} />
                <YAxis orientation="left" stroke="#25e6c8" tick={{ fontSize: 12, fill: '#a9afba' }} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="몸무게"
                  stroke="#25e6c8"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#25e6c8' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>

      {!isRecordedToday ? (
        <Card title="오늘 기록 등록">
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.inputGroup}>
              <span style={styles.label}>오늘의 몸무게</span>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                placeholder="75.5"
                className="text-input"
              />
            </label>
            <label style={styles.inputGroup}>
              <span style={styles.label}>운동 메모</span>
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="오늘 운동은 어땠나요?"
                className="text-input"
                style={{ height: '92px', resize: 'none' }}
              />
            </label>
            <p style={styles.infoText}>성공률은 오늘 계획 중 완료한 운동 비율로 계산됩니다.</p>
            <Button type="submit">기록하기</Button>
          </form>
        </Card>
      ) : (
        <Card style={styles.doneCard}>
          <strong>오늘 기록이 완료되었습니다.</strong>
        </Card>
      )}

      <Card title="최근 메모">
        {workouts.length === 0 ? (
          <p style={styles.emptyText}>메모가 없습니다.</p>
        ) : (
          <div style={styles.memoList}>
            {workouts.slice().reverse().map(workout => (
              <div key={workout.id} style={styles.memoItem}>
                <div style={styles.memoHeader}>
                  <span style={styles.memoDate}>{workout.createdAt}</span>
                  <span style={styles.memoWeight}>{workout.weight}kg</span>
                </div>
                <p style={styles.memoContent}>{workout.memo || '메모 없음'}</p>
                <div style={styles.memoRate}>성공률 {Math.round(workout.successRate || 0)}%</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  return (
    <div style={styles.tooltip}>
      <p style={{ fontWeight: '900', margin: '0 0 6px' }}>{label}</p>
      <p style={{ color: 'var(--primary-color)', margin: 0 }}>몸무게 {data.weight}kg</p>
      <p style={{ color: 'var(--accent-warm)', margin: 0 }}>성공률 {Math.round(data.successRate || 0)}%</p>
      {data.memo && <p style={styles.tooltipMemo}>메모: {data.memo}</p>}
    </div>
  );
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
  emptyText: {
    textAlign: 'center',
    padding: '28px 0',
    margin: 0,
    color: 'var(--text-secondary)',
  },
  chart: {
    width: '100%',
    height: 290,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    color: 'var(--text-secondary)',
    fontSize: '13px',
    fontWeight: '800',
  },
  infoText: {
    margin: 0,
    color: 'var(--text-muted)',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  doneCard: {
    borderColor: 'rgba(37, 230, 200, 0.28)',
    color: 'var(--primary-color)',
  },
  memoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  memoItem: {
    padding: '12px',
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
  },
  memoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  memoDate: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'var(--text-secondary)',
  },
  memoWeight: {
    fontSize: '13px',
    color: 'var(--primary-color)',
    fontWeight: '900',
  },
  memoContent: {
    fontSize: '14px',
    margin: '0 0 8px',
    lineHeight: 1.45,
    color: 'var(--text-primary)',
  },
  memoRate: {
    fontSize: '12px',
    color: 'var(--accent-warm)',
    fontWeight: '900',
  },
  tooltip: {
    background: 'var(--surface-bg)',
    padding: '10px',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-primary)',
  },
  tooltipMemo: {
    color: 'var(--text-secondary)',
    margin: '6px 0 0',
    fontSize: '12px',
    maxWidth: '200px',
  }
};

export default Stats;
