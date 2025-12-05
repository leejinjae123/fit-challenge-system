import React from 'react';
import { Button, Card } from '../components/Common';

const Stats = () => {
  return (
    <>
        <Card title="운동 기록">
            <p>당신의 운동기록을 입력해보세요!</p>
        </Card>

        <div style={{ marginTop: 'auto' }}>
            <Button variant="secondary" >
                나의 운동 기록
            </Button>
        </div>
    </> 
  );
};

export default Stats;

