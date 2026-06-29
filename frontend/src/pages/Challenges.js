import React, { useEffect, useState } from 'react';
import { Button, Card } from '../components/Common';
import AuthService from '../services/AuthService';
import ChallengeService from '../services/ChallengeService';

const Challenges = () => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const fallbackUserId = Number(localStorage.getItem('userId') || 1);
      try {
        const user = await AuthService.getMyInfo();
        setUserId(user.id);
        setItems(await ChallengeService.getChallenges(user.id));
      } catch (error) {
        setUserId(fallbackUserId);
        setItems(await ChallengeService.getChallenges(fallbackUserId));
      }
    } catch (error) {
      console.error('Failed to load challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoin = async (challengeId) => {
    try {
      await ChallengeService.joinChallenge(challengeId, userId);
      await loadData();
    } catch (error) {
      alert(error.message || '챌린지 참가에 실패했습니다.');
    }
  };

  const handleComplete = async (challenge) => {
    try {
      const result = await ChallengeService.completeChallenge(challenge.id, userId);
      if (result.status !== 'COMPLETED') {
        alert(`아직 목표까지 ${result.targetValue - result.progressCount}만큼 남았습니다.`);
      } else if (challenge.status !== 'COMPLETED') {
        await AuthService.chargePoints(result.rewardPoints);
        alert(`${result.rewardPoints}포인트를 받았습니다.`);
      }
      await loadData();
    } catch (error) {
      alert(error.message || '챌린지 완료 처리에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '200px', color: 'var(--text-secondary)' }}>Loading...</div>;
  }

  return (
    <div style={styles.page}>
      <div>
        <p style={styles.kicker}>챌린지</p>
        <h2 style={styles.title}>도전 과제</h2>
      </div>

      {items.map(item => (
        <Card key={item.id}>
          <div style={styles.challengeHeader}>
            <div>
              <h3 style={styles.challengeTitle}>{item.title}</h3>
              <p style={styles.description}>{item.description}</p>
            </div>
            <span style={styles.reward}>{item.rewardPoints}P</span>
          </div>

          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPercent(item)}%` }} />
          </div>

          <div style={styles.metaRow}>
            <span>{item.progressCount || 0} / {item.targetValue}</span>
            <span>{item.participantCount} / {item.capacity}명</span>
          </div>

          {item.status === 'COMPLETED' ? (
            <Button variant="secondary" disabled>완료됨</Button>
          ) : item.joined ? (
            <Button onClick={() => handleComplete(item)}>완료 확인</Button>
          ) : (
            <Button onClick={() => handleJoin(item.id)}>참가하기</Button>
          )}
        </Card>
      ))}
    </div>
  );
};

const progressPercent = (item) => {
  if (!item.targetValue) return 0;
  return Math.min(100, Math.round(((item.progressCount || 0) / item.targetValue) * 100));
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
  challengeHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '12px',
    alignItems: 'start',
  },
  challengeTitle: {
    margin: '0 0 7px',
    fontSize: '17px',
    fontWeight: '900',
  },
  description: {
    margin: 0,
    color: 'var(--text-secondary)',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  reward: {
    padding: '6px 9px',
    borderRadius: '999px',
    background: 'rgba(245, 200, 93, 0.12)',
    color: 'var(--accent-warm)',
    fontSize: '12px',
    fontWeight: '900',
  },
  progressTrack: {
    height: '8px',
    margin: '17px 0 9px',
    borderRadius: '999px',
    background: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '999px',
    background: 'var(--primary-color)',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px',
    color: 'var(--text-muted)',
    fontSize: '12px',
    fontWeight: '800',
  },
};

export default Challenges;
