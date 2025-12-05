import React, { useState } from 'react';
import { Button, Card, StatusBox } from '../components/Common';

const Home = () => {
  const [status, setStatus] = useState('Waiting for AI...');

  return (
    <>
      <Card title="AI 코치">
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          추천 운동 & 루틴
        </p>
        <StatusBox label="추천 운동" value={status} />
      </Card>

      <div style={{ marginTop: 'auto' }}>
        <Button onClick={() => setStatus('루틴 업로드 중...')}>
          루틴 업로드
        </Button>
      </div>
    </>
  );
};

export default Home;

