import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import ChallengeService from '../services/ChallengeService';
import AuthService from '../services/AuthService';
import ExerciseListModal from '../components/ExerciseListModal';
import HistoryModal from '../components/HistoryModal';

const todayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [completedRecords, setCompletedWorkouts] = useState([]);
  const [allWorkoutRecords, setAllWorkoutRecords] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllExercisesModal, setShowAllExercisesModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const requireAuth = () => {
    if (!userInfo) {
      if (window.confirm('로그인이 필요한 기능입니다. 로그인 화면으로 이동할까요?')) {
        navigate('/login');
      }
      return false;
    }
    return true;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getMyInfo();
      if (user) {
        setUserInfo(user);
        const allRecords = await ChallengeService.getMyWorkoutRecords(user.id);
        setPlannedWorkouts(allRecords.filter(record => record.status === 'PLANNED' && record.planDate === todayKey()));
        setCompletedWorkouts(allRecords.filter(record => record.status === 'COMPLETED'));
        setAllWorkoutRecords(allRecords);
      }
    } catch (error) {
      console.error('Data loading failed:', error);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddPlans = async (plans) => {
    if (!requireAuth()) return;
    try {
      await Promise.all(plans.map(plan => ChallengeService.createWorkoutRecord(plan, userInfo?.id)));
      alert(`${plans.length}개의 운동 계획을 추가했습니다.`);
      setShowAllExercisesModal(false);
      setShowRecommendationModal(false);
      loadData();
    } catch (error) {
      alert('계획 추가에 실패했습니다.');
    }
  };

  const handleCompletePlannedWorkout = async (workout) => {
    if (!requireAuth()) return;
    try {
      if (!window.confirm(`${workout.exerciseType} 운동을 완료할까요?`)) return;
      await ChallengeService.completeWorkoutRecord(workout.id, userInfo?.id);
      alert('운동 완료. 수고하셨습니다.');
      loadData();
    } catch (error) {
      alert('완료 처리에 실패했습니다.');
    }
  };

  const handleDeleteWorkout = async (event, recordId) => {
    event.stopPropagation();
    if (!requireAuth()) return;
    if (!window.confirm('이 계획을 삭제할까요?')) return;
    try {
      await ChallengeService.deleteWorkoutRecord(recordId, userInfo?.id);
      loadData();
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  const routineMeta = useMemo(() => {
    const totalSets = plannedWorkouts.reduce((sum, workout) => sum + Number(workout.sets || 0), 0);
    const minutes = plannedWorkouts.length === 0 ? 0 : Math.max(18, plannedWorkouts.length * 8 + totalSets * 2);
    return { totalSets, minutes };
  }, [plannedWorkouts]);

  if (loading) {
    return <div className="flex-center" style={{ height: '100%', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>오늘의 루틴</p>
          <h2 style={styles.heroTitle}>
            {userInfo ? `${userInfo.nickname}님, 바로 시작해볼까요?` : '로그인하고 맞춤 루틴을 받아보세요'}
          </h2>
        </div>
        <div style={styles.metaRow}>
          <Meta label="운동" value={`${plannedWorkouts.length}개`} />
          <Meta label="예상" value={routineMeta.minutes ? `${routineMeta.minutes}분` : '-'} />
          <Meta label="완료" value={`${completedRecords.length}회`} />
        </div>
        <Button onClick={() => userInfo ? setShowRecommendationModal(true) : navigate('/login')}>
          {userInfo ? 'AI 추천 루틴 받기' : '로그인하기'}
        </Button>
      </section>

      <div style={styles.sectionHeader}>
        <h3 style={styles.sectionTitle}>오늘의 운동 계획</h3>
        <button
          onClick={() => requireAuth() && setShowHistoryModal(true)}
          style={styles.textButton}
        >
          이전 계획
        </button>
      </div>

      <Card>
        {plannedWorkouts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyVisual}>
              <span style={styles.emptyPulse}></span>
            </div>
            <p style={styles.emptyTitle}>아직 계획된 운동이 없습니다.</p>
            <p style={styles.emptyText}>운동 목록에서 직접 고르거나, 현재 레벨에 맞는 추천 루틴을 받아보세요.</p>
            <Button onClick={() => userInfo ? setShowRecommendationModal(true) : navigate('/login')}>
              {userInfo ? '추천 루틴 만들기' : '로그인 후 시작하기'}
            </Button>
          </div>
        ) : (
          <div style={styles.planList}>
            {plannedWorkouts.map((workout, index) => (
              <button
                key={workout.id}
                style={styles.planCard}
                onClick={() => handleCompletePlannedWorkout(workout)}
              >
                <span style={styles.planIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span style={styles.planInfo}>
                  <strong style={styles.exerciseName}>{workout.exerciseType}</strong>
                  <span style={styles.exerciseInfo}>{workout.sets}세트 · {workout.reps}회</span>
                </span>
                <span style={styles.statusBadge}>진행 중</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => handleDeleteWorkout(event, workout.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleDeleteWorkout(event, workout.id);
                  }}
                  style={styles.deleteBtn}
                >
                  삭제
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {completedRecords.length > 0 && (
        <Card title="최근 완료 기록">
          <div style={styles.recordList}>
            {completedRecords.slice(0, 5).map((record) => (
              <div key={record.id} style={styles.recordItem}>
                <div>
                  <span style={styles.recordType}>{record.exerciseType}</span>
                  <span style={styles.recordDate}>{new Date(record.performedAt).toLocaleDateString()}</span>
                </div>
                <div style={styles.recordStats}>
                  <span>{record.count || '-'}회</span>
                  <small>정확도 {Math.round((record.accuracy || 0) * 100)}%</small>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showAllExercisesModal && (
        <ExerciseListModal
          onClose={() => setShowAllExercisesModal(false)}
          onAddPlans={handleAddPlans}
          userId={userInfo?.id}
        />
      )}

      {showRecommendationModal && (
        <ExerciseListModal
          onClose={() => setShowRecommendationModal(false)}
          onAddPlans={handleAddPlans}
          userId={userInfo?.id}
          isRecommendation={true}
          initialLevel={userInfo?.levelCode || 'L10'}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          allRecords={allWorkoutRecords}
        />
      )}

      <div style={styles.bottomButtonContainer}>
        <button style={styles.fullWidthButton} onClick={() => requireAuth() && setShowAllExercisesModal(true)}>
          운동 계획 추가하기
        </button>
      </div>
    </>
  );
};

const Meta = ({ label, value }) => (
  <div style={styles.metaItem}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const styles = {
  hero: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    padding: '22px',
    borderRadius: '16px',
    background: 'linear-gradient(145deg, rgba(37, 230, 200, 0.16), rgba(32, 35, 41, 0.92) 42%, rgba(22, 24, 29, 1))',
    border: '1px solid rgba(37, 230, 200, 0.22)',
    boxShadow: 'var(--shadow-md)',
  },
  kicker: {
    margin: '0 0 8px',
    color: 'var(--primary-color)',
    fontSize: '13px',
    fontWeight: '800',
  },
  heroTitle: {
    margin: 0,
    fontSize: '25px',
    lineHeight: 1.25,
    fontWeight: '900',
  },
  metaRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'var(--text-secondary)',
    fontSize: '12px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '900',
  },
  textButton: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 8px',
    textAlign: 'center',
  },
  emptyVisual: {
    width: '78px',
    height: '78px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(37, 230, 200, 0.26), rgba(37, 230, 200, 0.04) 68%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyPulse: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--primary-color)',
    boxShadow: '0 0 24px rgba(37, 230, 200, 0.55)',
  },
  emptyTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '900',
  },
  emptyText: {
    margin: 0,
    color: 'var(--text-secondary)',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  planList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  planCard: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '34px 1fr auto',
    alignItems: 'center',
    gap: '10px',
    padding: '13px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    textAlign: 'left',
    cursor: 'pointer',
  },
  planIndex: {
    color: 'var(--primary-color)',
    fontWeight: '900',
    fontSize: '13px',
  },
  planInfo: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  exerciseName: {
    color: 'var(--text-primary)',
    fontSize: '15px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  exerciseInfo: {
    color: 'var(--text-secondary)',
    fontSize: '12px',
    fontWeight: '700',
  },
  statusBadge: {
    padding: '5px 8px',
    borderRadius: '999px',
    background: 'rgba(37, 230, 200, 0.12)',
    color: 'var(--primary-color)',
    fontSize: '11px',
    fontWeight: '900',
  },
  deleteBtn: {
    gridColumn: '3',
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: '800',
  },
  recordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recordItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '12px',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
  },
  recordType: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '800',
  },
  recordDate: {
    color: 'var(--text-muted)',
    fontSize: '12px',
  },
  recordStats: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '3px',
    color: 'var(--primary-color)',
    fontWeight: '900',
  },
  bottomButtonContainer: {
    position: 'fixed',
    bottom: 'calc(var(--bottom-nav-height) + var(--safe-area-bottom) + 14px)',
    left: '0',
    right: '0',
    padding: '0 16px',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  fullWidthButton: {
    width: '100%',
    maxWidth: '588px',
    minHeight: '48px',
    padding: '13px 16px',
    borderRadius: '12px',
    backgroundColor: 'var(--primary-color)',
    color: '#061310',
    border: 'none',
    fontSize: '15px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
    pointerEvents: 'auto',
  }
};

export default Home;
