import React, { useEffect, useState } from 'react';
import { Button, Card } from '../components/Common';
import ChallengeService from '../services/ChallengeService';
import AuthService from '../services/AuthService';
import ExerciseListModal from '../components/ExerciseListModal';
import HistoryModal from '../components/HistoryModal';

const Home = () => {
  const [plannedWorkouts, setPlannedWorkouts] = useState([]);
  const [completedRecords, setCompletedWorkouts] = useState([]);
  const [allWorkoutRecords, setAllWorkoutRecords] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllExercisesModal, setShowAllExercisesModal] = useState(false);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // 데이터 로딩
  const loadData = async () => {
    try {
      setLoading(true);
      const user = await AuthService.getMyInfo();
      setUserInfo(user);

      const allRecords = await ChallengeService.getMyWorkoutRecords(user.id);
      
      // 오늘 날짜 구하기 (YYYY-MM-DD 형식)
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      
      // 오늘 계획만 필터링
      const planned = allRecords.filter(r => 
        r.status === 'PLANNED' && r.planDate === todayStr
      );
      
      setPlannedWorkouts(planned);
      setCompletedWorkouts(allRecords.filter(r => r.status === 'COMPLETED'));
      setAllWorkoutRecords(allRecords); // 전체 기록 저장 (이전 계획 보기용)
    } catch (error) {
      console.error('Data loading failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 계획 일괄 추가 핸들러
  const handleAddPlans = async (plans) => {
    try {
      await Promise.all(plans.map(plan => 
        ChallengeService.createWorkoutRecord(plan, userInfo?.id)
      ));
      alert(`${plans.length}개의 운동 계획이 추가되었습니다!`);
      setShowAllExercisesModal(false);
      setShowRecommendationModal(false);
      loadData();
    } catch (error) {
      alert('계획 추가 실패');
    }
  };

  // 계획 완료 처리
  const handleCompletePlannedWorkout = async (workout) => {
    try {
      if (!window.confirm(`${workout.exerciseType}을(를) 완료하셨나요?`)) return;
      await ChallengeService.completeWorkoutRecord(workout.id, userInfo?.id);
      alert('운동 완료! 수고하셨습니다.');
      loadData();
    } catch (error) {
      alert('완료 처리 실패');
    }
  };

  // 계획 삭제 처리
  const handleDeleteWorkout = async (e, recordId) => {
    e.stopPropagation(); // 카드 클릭 방지
    if (!window.confirm('이 계획을 삭제하시겠습니까?')) return;
    try {
      await ChallengeService.deleteWorkoutRecord(recordId, userInfo?.id);
      loadData();
    } catch (error) {
      alert('삭제 실패');
    }
  };

  if (loading) return <div className="flex-center" style={{ height: '100%' }}>Loading...</div>;

  return (
    <>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '4px' }}>
          안녕하세요, {userInfo?.nickname}님! 👋
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          오늘은 어떤 운동을 해볼까요?
        </p>
      </div>

      {/* 1. 오늘의 계획 목록 - 모달과 동일한 뷰 적용 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>오늘의 운동 계획</h3>
        <button 
          onClick={() => setShowHistoryModal(true)}
          style={{ 
            backgroundColor: 'transparent', 
            border: 'none', 
            color: '#4F46E5', 
            fontSize: '14px', 
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          이전 계획 보기
        </button>
      </div>

      <Card style={{ marginBottom: '20px' }}>
        {plannedWorkouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '15px' }}>
              아직 계획된 운동이 없습니다.<br/>
              나에게 맞는 운동 루틴을 추천받아보세요!
            </p>
            <Button onClick={() => setShowRecommendationModal(true)}>
              운동 루틴 추천받기
            </Button>
          </div>
        ) : (
          <div style={styles.gridList}>
            {plannedWorkouts.map((workout) => (
              <div 
                key={workout.id} 
                style={styles.planCard}
                onClick={() => handleCompletePlannedWorkout(workout)}
              >
                <div style={styles.infoArea}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4 style={styles.exerciseName}>{workout.exerciseType}</h4>
                    <button 
                      onClick={(e) => handleDeleteWorkout(e, workout.id)}
                      style={styles.deleteBtn}
                    >
                      ✕
                    </button>
                  </div>
                  <p style={styles.exerciseInfo}>{workout.sets}세트 ✕ {workout.reps}회</p>
                  <div style={{ marginTop: '8px' }}>
                    <span style={styles.statusBadge}>진행 중</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 2. 최근 완료 기록 */}
      {completedRecords.length > 0 && (
        <Card title="최근 완료 기록" style={{ marginBottom: '100px' }}>
          <div style={styles.list}>
            {completedRecords.slice(0, 5).map((record) => (
              <div key={record.id} style={styles.recordItem}>
                <div style={{ flex: 1 }}>
                  <span style={styles.recordType}>{record.exerciseType}</span>
                  <span style={styles.recordDate}>
                    {new Date(record.performedAt).toLocaleDateString()}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.recordCount}>{record.count}회</span>
                  <span style={styles.recordAccuracy}>정확도 {Math.round(record.accuracy * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 전체 운동 목록 모달 (다중 선택 지원) */}
      {showAllExercisesModal && (
        <ExerciseListModal 
          onClose={() => setShowAllExercisesModal(false)}
          onAddPlans={handleAddPlans}
          userId={userInfo?.id}
        />
      )}

      {/* 추천 운동 모달 (숙련도 기준 정렬) */}
      {showRecommendationModal && (
        <ExerciseListModal 
          onClose={() => setShowRecommendationModal(false)}
          onAddPlans={handleAddPlans}
          userId={userInfo?.id}
          isRecommendation={true}
          initialLevel={userInfo?.levelCode || 'L10'}
        />
      )}

      {/* 이전 계획 보기 모달 */}
      {showHistoryModal && (
        <HistoryModal 
          onClose={() => setShowHistoryModal(false)}
          allRecords={allWorkoutRecords}
          userId={userInfo?.id}
        />
      )}

      {/* 하단 고정 버튼 */}
      <div style={styles.bottomButtonContainer}>
        <button style={styles.fullWidthButton} onClick={() => setShowAllExercisesModal(true)}>
          + 운동 계획 추가하기
        </button>
      </div>
    </>
  );
};

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  gridList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  // 모달 스타일을 적용한 계획 카드
  planCard: {
    display: 'flex',
    flexDirection: 'column', // 가로 2열이므로 세로 배치가 더 어울림
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#fff',
    borderRadius: '16px', // 더 둥글게
    border: '1px solid #f3f4f6',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // 그림자 강화
    cursor: 'pointer',
    minHeight: '120px',
    transition: 'transform 0.2s ease',
  },
  // 추천 카드 스타일
  recoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #E5E7EB',
  },
  recoImageArea: {
    height: '80px',
    backgroundColor: '#E5E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoInfo: {
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  recoName: {
    fontSize: '14px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#111827',
  },
  recoDesc: {
    fontSize: '11px',
    color: '#6B7280',
    margin: '0 0 12px 0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    height: '32px',
  },
  recoActions: {
    display: 'flex',
    gap: '6px',
    marginTop: 'auto',
  },
  addBtn: {
    flex: 2,
    padding: '6px 0',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  removeBtn: {
    flex: 1,
    padding: '6px 0',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  infoArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  exerciseName: {
    fontSize: '17px', // 살짝 더 크게
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#111827',
    lineHeight: '1.3',
  },
  exerciseInfo: {
    fontSize: '15px', // 살짝 더 크게
    color: '#10B981', 
    fontWeight: '800', // 더 굵게
    margin: 0,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '0 0 0 8px',
  },
  statusBadge: {
    fontSize: '10px',
    padding: '2px 8px',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    borderRadius: '4px',
    fontWeight: '500',
  },
  imageArea: {
    width: '70px',
    minWidth: '70px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #F3F4F6',
  },
  recordType: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
  },
  recordDate: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
  recordCount: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--primary-color)',
  },
  recordAccuracy: {
    fontSize: '11px',
    color: '#6B7280',
  },
  bottomButtonContainer: {
    position: 'fixed',
    bottom: 'calc(var(--bottom-nav-height) + var(--safe-area-bottom) + 16px)',
    left: '0',
    right: '0',
    padding: '0 20px',
    zIndex: 5,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  fullWidthButton: {
    width: '100%',
    maxWidth: '600px',
    padding: '14px',
    borderRadius: '12px',
    backgroundColor: '#10B981',
    color: 'white',
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    pointerEvents: 'auto',
  }
};

export default Home;
