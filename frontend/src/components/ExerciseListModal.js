import React, { useCallback, useEffect, useRef, useState } from 'react';
import ChallengeService from '../services/ChallengeService';

const ExerciseListModal = ({ onClose, onAddPlans, userId, isRecommendation = false, initialLevel = '' }) => {
  const [exercises, setExercises] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
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

  const loadExercises = useCallback(async (pageNumber, currentSearch, currentFilters) => {
    try {
      setLoading(true);

      let response;
      if (isRecommendation && pageNumber === 0 && !currentSearch && !currentFilters.categoryCode && !currentFilters.targetCode) {
        const recoList = await ChallengeService.getRecommendations(currentFilters.levelCode || 'L10', userId);
        response = { content: recoList, last: true };
      } else {
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
      setExercises(prev => pageNumber === 0 ? newExercises : [...prev, ...newExercises]);
      setHasMore(!response.last);

      setPlanValues(prev => {
        const updated = { ...prev };
        newExercises.forEach(exercise => {
          if (!updated[exercise.id]) {
            updated[exercise.id] = {
              sets: exercise.sets || 3,
              reps: exercise.reps || 12
            };
          }
        });
        return updated;
      });
    } catch (error) {
      console.error('Failed to load exercises:', error);
    } finally {
      setLoading(false);
    }
  }, [isRecommendation, userId]);

  useEffect(() => {
    loadExercises(page, search, filters);
  }, [page, search, filters, loadExercises]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    setPage(0);
  };

  const handleFilterChange = (name, value) => {
    const nextFilters = { ...filters, [name]: value };
    setFilters(nextFilters);
    setPage(0);
  };

  const handleValueChange = (id, field, val) => {
    setPlanValues(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: parseInt(val, 10) || 0 }
    }));
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleConfirm = () => {
    if (selectedIds.length === 0) return;

    const selectedPlans = selectedIds.map(id => {
      const exercise = exercises.find(item => item.id === id);
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
      <div style={styles.modal} onClick={event => event.stopPropagation()}>
        <div style={styles.handle} />
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>{isRecommendation ? 'AI 추천' : '운동 라이브러리'}</p>
            <h3 style={styles.title}>{isRecommendation ? '오늘 할 루틴을 골라보세요' : '운동 계획 추가'}</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>닫기</button>
        </div>

        <div style={styles.searchBar}>
          <span style={styles.searchIcon}>⌕</span>
          <input
            type="text"
            placeholder="운동 이름 검색"
            value={search}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterContainer}>
          <select value={filters.levelCode} onChange={(event) => handleFilterChange('levelCode', event.target.value)} style={styles.filterSelect}>
            <option value="">레벨 전체</option>
            <option value="L10">초급</option>
            <option value="L20">중급</option>
            <option value="L30">상급</option>
          </select>

          <select value={filters.categoryCode} onChange={(event) => handleFilterChange('categoryCode', event.target.value)} style={styles.filterSelect}>
            <option value="">유형 전체</option>
            <option value="C_CD">유산소</option>
            <option value="C_ST">근력</option>
            <option value="C_MB">가동성</option>
          </select>

          <select value={filters.targetCode} onChange={(event) => handleFilterChange('targetCode', event.target.value)} style={styles.filterSelect}>
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
                  ...(isSelected ? styles.itemSelected : {})
                }}
                onClick={() => toggleSelection(exercise.id)}
              >
                <div style={styles.imageArea}>
                  {exercise.imageUrl ? (
                    <img
                      src={exercise.imageUrl}
                      alt={`${exercise.exerciseName} 예시`}
                      loading="lazy"
                      style={styles.exerciseImage}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>No demo</div>
                  )}
                </div>

                <div style={styles.infoArea}>
                  <div style={styles.nameRow}>
                    <h4 style={styles.name}>{exercise.exerciseName}</h4>
                    {isSelected && <span style={styles.selectedBadge}>선택</span>}
                  </div>
                  <p style={styles.desc}>{exercise.description || '자극 부위를 확인하며 천천히 진행하세요.'}</p>

                  <div style={styles.planControl} onClick={event => event.stopPropagation()}>
                    <label style={styles.inputGroup}>
                      <input
                        type="number"
                        value={values.sets}
                        onChange={(event) => handleValueChange(exercise.id, 'sets', event.target.value)}
                        style={styles.inlineInput}
                      />
                      <span style={styles.inputLabel}>set</span>
                    </label>
                    <label style={styles.inputGroup}>
                      <input
                        type="number"
                        value={values.reps}
                        onChange={(event) => handleValueChange(exercise.id, 'reps', event.target.value)}
                        style={styles.inlineInput}
                      />
                      <span style={styles.inputLabel}>reps</span>
                    </label>
                  </div>

                  <div style={styles.badges}>
                    <span style={styles.badge}>{getTargetLabel(exercise.targetCode)}</span>
                    <span style={styles.badge}>{getLevelLabel(exercise.levelCode)}</span>
                    <span style={styles.badge}>{getCategoryLabel(exercise.categoryCode)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && <div style={styles.stateText}>Loading...</div>}
          {!loading && exercises.length === 0 && <div style={styles.stateText}>검색 결과가 없습니다.</div>}
        </div>

        <div style={styles.footer}>
          <button
            style={{
              ...styles.confirmButton,
              ...(selectedIds.length === 0 ? styles.confirmButtonDisabled : {})
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
  switch (code) {
    case 'L10': return '초급';
    case 'L20': return '중급';
    case 'L30': return '상급';
    default: return code || '레벨';
  }
};

const getCategoryLabel = (code) => {
  switch (code) {
    case 'C_ST': return '근력';
    case 'C_CD': return '유산소';
    case 'C_MB': return '가동성';
    default: return code || '유형';
  }
};

const getTargetLabel = (code) => {
  switch (code) {
    case 'T_LG': return '하체';
    case 'T_BK': return '등';
    case 'T_CH': return '가슴';
    case 'T_SH': return '어깨';
    case 'T_AR': return '팔';
    case 'T_CR': return '코어';
    case 'T_WH': return '전신';
    default: return code || '부위';
  }
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: 2000,
  },
  modal: {
    width: '100%',
    maxWidth: '620px',
    height: 'calc(100vh - 42px)',
    marginTop: '42px',
    padding: '10px 16px 0',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface-bg)',
    borderTopLeftRadius: '18px',
    borderTopRightRadius: '18px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 -18px 40px rgba(0, 0, 0, 0.42)',
  },
  handle: {
    width: '46px',
    height: '4px',
    borderRadius: '999px',
    margin: '0 auto 14px',
    background: 'var(--card-bg-soft)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '14px',
  },
  kicker: {
    color: 'var(--primary-color)',
    margin: '0 0 6px',
    fontSize: '12px',
    fontWeight: '900',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '900',
  },
  closeBtn: {
    border: '1px solid var(--border-color)',
    background: 'var(--card-bg)',
    color: 'var(--text-secondary)',
    borderRadius: '999px',
    padding: '7px 10px',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    marginBottom: '10px',
  },
  searchIcon: {
    color: 'var(--primary-color)',
    fontSize: '18px',
    fontWeight: '900',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    color: 'var(--text-primary)',
    fontSize: '14px',
  },
  filterContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '12px',
  },
  filterSelect: {
    minWidth: '94px',
    padding: '8px 10px',
    borderRadius: '999px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    fontSize: '12px',
    fontWeight: '800',
    outline: 'none',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    paddingBottom: '18px',
  },
  item: {
    display: 'grid',
    gridTemplateColumns: '92px 1fr',
    gap: '12px',
    padding: '10px',
    background: 'var(--card-bg)',
    borderRadius: '14px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
  },
  itemSelected: {
    border: '1px solid rgba(37, 230, 200, 0.72)',
    boxShadow: '0 0 0 2px rgba(37, 230, 200, 0.11)',
    transform: 'translateY(-1px)',
  },
  imageArea: {
    width: '92px',
    minWidth: '92px',
    height: '112px',
    background: '#f5f5f1',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  imagePlaceholder: {
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: '800',
  },
  infoArea: {
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '8px',
    alignItems: 'flex-start',
  },
  name: {
    margin: '0 0 5px',
    color: 'var(--text-primary)',
    fontSize: '15px',
    fontWeight: '900',
    lineHeight: 1.25,
  },
  selectedBadge: {
    flexShrink: 0,
    padding: '3px 6px',
    borderRadius: '999px',
    background: 'rgba(37, 230, 200, 0.14)',
    color: 'var(--primary-color)',
    fontSize: '10px',
    fontWeight: '900',
  },
  desc: {
    margin: 0,
    color: 'var(--text-secondary)',
    fontSize: '12px',
    lineHeight: 1.45,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  planControl: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    marginBottom: '9px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '5px 8px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
  },
  inlineInput: {
    width: '36px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '900',
    outline: 'none',
  },
  inputLabel: {
    color: 'var(--text-muted)',
    fontSize: '11px',
    fontWeight: '800',
  },
  badges: {
    display: 'flex',
    gap: '6px',
  },
  badge: {
    padding: '3px 7px',
    background: 'rgba(255, 255, 255, 0.06)',
    borderRadius: '999px',
    color: 'var(--text-secondary)',
    fontSize: '10px',
    fontWeight: '800',
  },
  stateText: {
    textAlign: 'center',
    padding: '28px 0',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  footer: {
    padding: '12px 0 calc(12px + var(--safe-area-bottom))',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  confirmButton: {
    width: '100%',
    minHeight: '48px',
    padding: '13px',
    borderRadius: '12px',
    background: 'var(--primary-color)',
    color: '#061310',
    border: 'none',
    fontSize: '15px',
    fontWeight: '900',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-lg)',
  },
  confirmButtonDisabled: {
    background: 'var(--card-bg-soft)',
    color: 'var(--text-muted)',
    boxShadow: 'none',
    cursor: 'not-allowed',
  }
};

export default ExerciseListModal;
