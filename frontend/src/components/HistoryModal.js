import React, { useState } from 'react';

const HistoryModal = ({ onClose, allRecords }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  const recordsByDate = allRecords.reduce((acc, record) => {
    const date = record.planDate;
    if (!date) return acc;
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let index = 0; index < firstDayOfMonth; index += 1) {
    days.push(<div key={`empty-${index}`} style={styles.calendarDayEmpty} />);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasRecords = Boolean(recordsByDate[dateStr]);
    const isSelected = selectedDateStr === dateStr;

    days.push(
      <button
        key={day}
        style={{
          ...styles.calendarDay,
          ...(hasRecords ? styles.hasRecords : {}),
          ...(isSelected ? styles.selectedDay : {})
        }}
        onClick={() => setSelectedDateStr(dateStr)}
      >
        {day}
        {hasRecords && <span style={styles.dot} />}
      </button>
    );
  }

  const selectedRecords = selectedDateStr ? (recordsByDate[selectedDateStr] || []) : [];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(event) => event.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>이전 계획</h2>
          <button onClick={onClose} style={styles.closeBtn}>닫기</button>
        </div>

        <div style={styles.calendarContainer}>
          <div style={styles.calendarHeader}>
            <button onClick={prevMonth} style={styles.navBtn}>이전</button>
            <span style={styles.monthTitle}>{year}년 {month + 1}월</span>
            <button onClick={nextMonth} style={styles.navBtn}>다음</button>
          </div>

          <div style={styles.weekHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map(day => (
              <div key={day} style={styles.weekDay}>{day}</div>
            ))}
          </div>

          <div style={styles.calendarGrid}>{days}</div>
        </div>

        <div style={styles.recordSection}>
          <h3 style={styles.sectionTitle}>
            {selectedDateStr ? `${selectedDateStr} 기록` : '날짜를 선택하세요'}
          </h3>
          {selectedRecords.length === 0 ? (
            <p style={styles.noData}>해당 날짜의 기록이 없습니다.</p>
          ) : (
            <div style={styles.recordList}>
              {selectedRecords.map(record => (
                <div key={record.id} style={styles.recordItem}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.exerciseName}>{record.exerciseType}</div>
                    <div style={styles.exerciseDetail}>
                      {record.status === 'PLANNED' ? `${record.sets}세트 · ${record.reps}회` : `${record.count || '-'}회 수행`}
                    </div>
                  </div>
                  <div style={{
                    ...styles.statusBadge,
                    ...(record.status === 'COMPLETED' ? styles.completedBadge : {})
                  }}>
                    {record.status === 'COMPLETED' ? '완료' : '계획'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.68)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    width: '100%',
    maxWidth: '420px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface-bg)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '18px',
    boxShadow: 'var(--shadow-md)',
  },
  header: {
    padding: '18px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  title: {
    margin: 0,
    fontSize: '19px',
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
  calendarContainer: {
    padding: '18px',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  navBtn: {
    border: 'none',
    background: 'transparent',
    color: 'var(--primary-color)',
    fontSize: '13px',
    fontWeight: '900',
    cursor: 'pointer',
    padding: '6px 4px',
  },
  monthTitle: {
    fontSize: '16px',
    fontWeight: '900',
  },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginBottom: '10px',
  },
  weekDay: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '800',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '6px',
  },
  calendarDay: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid transparent',
    borderRadius: '9px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    position: 'relative',
    fontSize: '13px',
    fontWeight: '800',
  },
  calendarDayEmpty: {
    aspectRatio: '1',
  },
  hasRecords: {
    backgroundColor: 'rgba(37, 230, 200, 0.1)',
    color: 'var(--primary-color)',
  },
  selectedDay: {
    backgroundColor: 'var(--primary-color)',
    color: '#061310',
  },
  dot: {
    width: '4px',
    height: '4px',
    backgroundColor: 'currentColor',
    borderRadius: '50%',
    marginTop: '3px',
  },
  recordSection: {
    padding: '18px',
    backgroundColor: 'rgba(255, 255, 255, 0.025)',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    flex: 1,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '900',
    margin: '0 0 12px',
  },
  noData: {
    fontSize: '13px',
    color: 'var(--text-muted)',
    textAlign: 'center',
    margin: '24px 0 8px',
  },
  recordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  recordItem: {
    backgroundColor: 'var(--card-bg)',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid var(--border-color)',
  },
  exerciseName: {
    fontSize: '14px',
    fontWeight: '900',
    color: 'var(--text-primary)',
  },
  exerciseDetail: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginTop: '3px',
  },
  statusBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '999px',
    fontWeight: '900',
    backgroundColor: 'rgba(245, 200, 93, 0.12)',
    color: 'var(--accent-warm)',
  },
  completedBadge: {
    backgroundColor: 'rgba(37, 230, 200, 0.12)',
    color: 'var(--primary-color)',
  }
};

export default HistoryModal;
