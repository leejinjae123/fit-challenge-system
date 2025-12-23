import React, { useState } from 'react';
import { Card } from './Common';

const HistoryModal = ({ onClose, allRecords }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  // 날짜별 기록 그룹화
  const recordsByDate = allRecords.reduce((acc, record) => {
    const date = record.planDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {});

  // 달력 계산
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  // 빈 칸 (이전 달 날짜)
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} style={styles.calendarDayEmpty}></div>);
  }

  // 이 달의 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasRecords = !!recordsByDate[dateStr];
    const isSelected = selectedDateStr === dateStr;

    days.push(
      <div 
        key={d} 
        style={{
          ...styles.calendarDay,
          ...(hasRecords ? styles.hasRecords : {}),
          ...(isSelected ? styles.selectedDay : {})
        }}
        onClick={() => setSelectedDateStr(dateStr)}
      >
        {d}
        {hasRecords && <div style={styles.dot}></div>}
      </div>
    );
  }

  const selectedRecords = selectedDateStr ? (recordsByDate[selectedDateStr] || []) : [];

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>이전 계획 보기</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.calendarContainer}>
          <div style={styles.calendarHeader}>
            <button onClick={prevMonth} style={styles.navBtn}>◀</button>
            <span style={styles.monthTitle}>{year}년 {month + 1}월</span>
            <button onClick={nextMonth} style={styles.navBtn}>▶</button>
          </div>
          
          <div style={styles.weekHeader}>
            {['일', '월', '화', '수', '목', '금', '토'].map(w => (
              <div key={w} style={styles.weekDay}>{w}</div>
            ))}
          </div>

          <div style={styles.calendarGrid}>
            {days}
          </div>
        </div>

        <div style={styles.recordSection}>
          <h3 style={styles.sectionTitle}>
            {selectedDateStr ? `${selectedDateStr} 기록` : '날짜를 선택해 주세요'}
          </h3>
          {selectedRecords.length === 0 ? (
            <p style={styles.noData}>해당 날짜에 기록이 없습니다.</p>
          ) : (
            <div style={styles.recordList}>
              {selectedRecords.map(record => (
                <div key={record.id} style={styles.recordItem}>
                  <div style={{ flex: 1 }}>
                    <div style={styles.exerciseName}>{record.exerciseType}</div>
                    <div style={styles.exerciseDetail}>
                      {record.status === 'PLANNED' ? `${record.sets}세트 × ${record.reps}회` : `${record.count}회 수행`}
                    </div>
                  </div>
                  <div style={{
                    ...styles.statusBadge,
                    backgroundColor: record.status === 'COMPLETED' ? '#D1FAE5' : '#EEF2FF',
                    color: record.status === 'COMPLETED' ? '#059669' : '#4F46E5'
                  }}>
                    {record.status === 'COMPLETED' ? '완료' : '계획됨'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    maxHeight: '90vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #F3F4F6',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#9CA3AF',
  },
  calendarContainer: {
    padding: '20px',
  },
  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    color: '#4F46E5',
    padding: '5px 10px',
  },
  monthTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  weekHeader: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    textAlign: 'center',
    marginBottom: '10px',
  },
  weekDay: {
    fontSize: '12px',
    color: '#9CA3AF',
    fontWeight: '500',
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '5px',
  },
  calendarDay: {
    aspectRatio: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    borderRadius: '8px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.2s',
  },
  calendarDayEmpty: {
    aspectRatio: '1',
  },
  hasRecords: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  selectedDay: {
    backgroundColor: '#4F46E5',
    color: 'white',
  },
  dot: {
    width: '4px',
    height: '4px',
    backgroundColor: 'currentColor',
    borderRadius: '50%',
    marginTop: '2px',
  },
  recordSection: {
    padding: '20px',
    backgroundColor: '#F9FAFB',
    borderTop: '1px solid #F3F4F6',
    flex: 1,
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '12px',
    margin: 0,
  },
  noData: {
    fontSize: '13px',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: '20px',
  },
  recordList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '12px',
  },
  recordItem: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '1px solid #F3F4F6',
  },
  exerciseName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#111827',
  },
  exerciseDetail: {
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '2px',
  },
  statusBadge: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600',
  }
};

export default HistoryModal;

