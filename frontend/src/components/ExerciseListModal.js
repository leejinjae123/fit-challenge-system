import React, { useEffect, useState, useRef, useCallback } from 'react';
import ChallengeService from '../services/ChallengeService';

const ExerciseListModal = ({ onClose, onAddPlans, userId, isRecommendation = false, initialLevel = '' }) => {
  const [exercises, setExercises] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  // 필터 상태
  const [filters, setFilters] = useState({
    levelCode: initialLevel,
    categoryCode: '',
    targetCode: ''
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [planValues, setPlanValues] = useState({});

  const observer = useRef();

  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // 데이터 로드 함수 (검색어 및 필터 포함)
  const loadExercises = useCallback(async (pageNumber, currentSearch, currentFilters) => {
    try {
      setLoading(true);
      
      let response;
      if (isRecommendation && pageNumber === 0 && !currentSearch && !currentFilters.categoryCode && !currentFilters.targetCode) {
        // 추천 모드이고 초기 상태일 때 추천 API 호출
        const recoList = await ChallengeService.getRecommendations(currentFilters.levelCode || 'L10', userId);
        response = {
          content: recoList,
          last: true // 추천은 페이징 없이 한 번에 가져옴
        };
      } else {
        // 일반 검색/필터 모드
        response = await ChallengeService.getAllExercises(
          pageNumber, 
          20, 
          currentSearch,
          currentFilters.levelCode,
          currentFilters.categoryCode,
          currentFilters.targetCode
        );
      }
      
      const newExercises = response.content || [];
      const isLast = response.last;

      setExercises(prev => pageNumber === 0 ? newExercises : [...prev, ...newExercises]);
      setHasMore(!isLast);

      const defaults = {};
      newExercises.forEach(ex => {
        if (!planValues[ex.id]) {
          defaults[ex.id] = { 
            sets: ex.sets || 3, 
            reps: ex.reps || 12 
          };
        }
      });
      setPlanValues(prev => ({ ...prev, ...defaults }));

    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  }, [isRecommendation, planValues]);

  useEffect(() => {
    loadExercises(page, search, filters);
  }, [page, search, filters, loadExercises]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(0);
    loadExercises(0, value, filters);
  };

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setPage(0);
    loadExercises(0, search, newFilters);
  };

  const handleValueChange = (id, field, val) => {
    setPlanValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseInt(val) || 0 }
    }));
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) return;
    const selectedPlans = selectedIds.map(id => {
      const exercise = exercises.find(ex => ex.id === id);
      const values = planValues[id] || { sets: 3, reps: 12 };
      return {
        exerciseType: exercise.exerciseName,
        sets: values.sets,
        reps: values.reps,
        count: values.sets * values.reps,
        status: 'PLANNED',
        performedAt: new Date().toISOString()
      };
    });
    onAddPlans(selectedPlans);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: '0 0 16px 0' }}>
              {isRecommendation ? '나를 위한 추천 루틴' : '운동 계획 추가'}
            </h3>
            
            <div style={styles.searchBar}>
              <span>🔍</span>
              <input 
                type="text" 
                placeholder="운동 명칭 검색..." 
                value={search}
                onChange={handleSearchChange}
                style={styles.searchInput}
              />
            </div>

            {/* 필터 영역 */}
            <div style={styles.filterContainer}>
              <select 
                value={filters.levelCode} 
                onChange={(e) => handleFilterChange('levelCode', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">난이도 전체</option>
                <option value="L10">초급</option>
                <option value="L20">중급</option>
                <option value="L30">고급</option>
              </select>

              <select 
                value={filters.categoryCode} 
                onChange={(e) => handleFilterChange('categoryCode', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">유형 전체</option>
                <option value="C_CD">유산소</option>
                <option value="C_ST">근력</option>
                <option value="C_MB">가동성</option>
              </select>

              <select 
                value={filters.targetCode} 
                onChange={(e) => handleFilterChange('targetCode', e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">부위 전체</option>
                <option value="T_LG">하체</option>
                <option value="T_BK">등</option>
                <option value="T_CH">가슴</option>
                <option value="T_SH">어깨</option>
                <option value="T_AR">팔</option>
                <option value="T_CR">코어</option>
                <option value="T_WH">전신</option>
              </select>
            </div>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        
        <div style={styles.listContainer}>
          {exercises.map((exercise, index) => {
            const isLastElement = exercises.length === index + 1;
            const isSelected = selectedIds.includes(exercise.id);
            const values = planValues[exercise.id] || { sets: 3, reps: 12 };

            return (
              <div 
                key={`${exercise.id}-${index}`} 
                ref={isLastElement ? lastElementRef : null}
                style={{
                  ...styles.item,
                  border: isSelected ? '2px solid #10B981' : '1px solid #f3f4f6',
                  boxShadow: isSelected ? '0 0 10px rgba(16, 185, 129, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                  transform: isSelected ? 'scale(1.005)' : 'scale(1)', // 커지는 효과를 아주 살짝만 적용
                  margin: '6px 4px', // 마진 추가로 간격 확보 및 크기 감소 효과
                  transition: 'all 0.2s ease',
                }}
                onClick={() => toggleSelection(exercise.id)}
              >
                <div style={styles.infoArea}>
                  <h4 style={styles.name}>{exercise.exerciseName}</h4>
                  <p style={styles.desc}>{exercise.description}</p>
                  
                  <div style={styles.planControl} onClick={e => e.stopPropagation()}>
                    <div style={styles.inputGroup}>
                      <input 
                        type="number" 
                        value={values.sets} 
                        onChange={(e) => handleValueChange(exercise.id, 'sets', e.target.value)}
                        style={styles.inlineInput}
                      />
                      <span style={styles.inputLabel}>세트</span>
                    </div>
                    <span style={{ margin: '0 8px', color: '#9CA3AF' }}>✕</span>
                    <div style={styles.inputGroup}>
                      <input 
                        type="number" 
                        value={values.reps} 
                        onChange={(e) => handleValueChange(exercise.id, 'reps', e.target.value)}
                        style={styles.inlineInput}
                      />
                      <span style={styles.inputLabel}>회</span>
                    </div>
                  </div>

                  <div style={styles.badges}>
                    <span style={styles.badge}>{getLevelLabel(exercise.levelCode)}</span>
                    <span style={styles.badge}>{getCategoryLabel(exercise.categoryCode)}</span>
                  </div>
                </div>

                <div style={styles.imageArea}>
                  <div style={styles.imagePlaceholder}>
                    <span style={{ fontSize: '20px', marginBottom: '4px' }}>📷</span>
                    <span style={{ fontSize: '9px', color: '#9CA3AF' }}>이미지 없음</span>
                  </div>
                </div>
              </div>
            );
          })}
          {loading && <div style={{ textAlign: 'center', padding: '10px' }}>Loading...</div>}
          {!loading && exercises.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>검색 결과가 없습니다.</div>
          )}
        </div>

        <div style={styles.footer}>
          <button 
            style={{
              ...styles.confirmButton,
              backgroundColor: selectedIds.length > 0 ? '#10B981' : '#D1D5DB'
            }} 
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
          >
            {selectedIds.length}개 운동 추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

const getLevelLabel = (code) => {
  switch(code) {
    case 'L10': return '초급';
    case 'L20': return '중급';
    case 'L30': return '고급';
    default: return code;
  }
};

const getCategoryLabel = (code) => {
    switch(code) {
      case 'C_ST': return '근력';
      case 'C_CD': return '유산소';
      case 'C_MB': return '가동성';
      default: return code;
    }
  };

const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 2000,
  },
  modal: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '600px',
    height: 'calc(100vh - 60px)', 
    marginTop: '60px',
    borderTopLeftRadius: '20px',
    borderTopRightRadius: '20px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.3s ease-out',
    boxShadow: '0 -4px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #eee',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: '8px 12px',
    borderRadius: '10px',
    width: '100%',
    marginBottom: '12px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'none',
    outline: 'none',
    fontSize: '14px',
    marginLeft: '8px',
  },
  filterContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
  },
  filterSelect: {
    padding: '6px 10px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    backgroundColor: 'white',
    fontSize: '12px',
    color: '#374151',
    outline: 'none',
    minWidth: '90px',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 0 0 12px',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingBottom: '20px',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: '12px 16px', // 패딩을 줄여 전체적인 크기 축소
    backgroundColor: '#fff',
    borderRadius: '12px',
    border: '1px solid #f3f4f6',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  infoArea: {
    flex: 1,
    paddingRight: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imageArea: {
    width: '80px',
    minWidth: '80px',
    backgroundColor: '#F3F4F6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  planControl: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    marginBottom: '8px',
    backgroundColor: '#F9FAFB',
    padding: '6px 10px',
    borderRadius: '8px',
    width: 'fit-content',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  inlineInput: {
    width: '35px',
    border: '1px solid #D1D5DB',
    borderRadius: '4px',
    padding: '2px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: '11px',
    color: '#6B7280',
  },
  badges: {
    display: 'flex',
    gap: '6px',
  },
  badge: {
    fontSize: '10px',
    padding: '2px 6px',
    backgroundColor: '#f3f4f6',
    borderRadius: '4px',
    color: '#4b5563',
  },
  name: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#111827',
  },
  desc: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    padding: '16px 0',
    borderTop: '1px solid #eee',
  },
  confirmButton: {
    width: '100%',
    padding: '14px',
    borderRadius: '12px',
    color: 'white',
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
  }
};

export default ExerciseListModal;
