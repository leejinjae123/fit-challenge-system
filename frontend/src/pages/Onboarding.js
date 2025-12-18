import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import OnboardingService from '../services/OnboardingService';
import '../styles/onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [helperOneRm, setHelperOneRm] = useState('');

  const [userInfo, setUserInfo] = useState({
    weight: '',
    height: '',
    levelCode: 'L10', // 초기값: 초급 (L10)
    goalCount: 3,
    email: '',
    password: '',
    nickname: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // 마지막 단계: 서버 전송
      setIsLoading(true);
      try {
        await OnboardingService.submitUserInfo(userInfo);
        // 성공 시 로컬 스토리지 플래그 저장 후 홈으로 이동
        localStorage.setItem('isOnboarded', 'true');
        alert('환영합니다! 회원가입이 완료되었습니다.');
        navigate('/'); 
      } catch (error) {
        console.error('Failed to submit onboarding data:', error);
        alert('저장에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateLevel = (oneRm) => {
    const weight = Number(oneRm);
    if (!oneRm || weight < 60) {
      setUserInfo(prev => ({ ...prev, levelCode: 'L10' }));
    } else if (weight >= 60 && weight <= 120) {
      setUserInfo(prev => ({ ...prev, levelCode: 'L20' }));
    } else {
      setUserInfo(prev => ({ ...prev, levelCode: 'L30' }));
    }
    setShowHelper(false);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <StepContent 
            title="몸무게를 알려주세요" 
            description="정확한 운동 강도 설정을 위해 필요해요."
          >
            <div className="input-group">
              <input 
                type="number" 
                name="weight"
                value={userInfo.weight} 
                onChange={handleChange} 
                placeholder="00" 
                autoFocus
              />
              <span className="unit">kg</span>
            </div>
            
            {/* 로그인 링크 추가 */}
            <div style={{ marginTop: '40px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                이미 계정이 있으신가요?
                <button 
                  onClick={() => navigate('/login')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary-color)', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    marginLeft: '8px',
                    fontSize: '14px'
                  }}
                >
                  로그인하기
                </button>
              </p>
            </div>
          </StepContent>
        );
      // ... 나머지 단계는 그대로 ...
      case 2:
        return (
          <StepContent 
            title="키는 어떻게 되시나요?" 
            description="BMI 지수 분석 등에 사용됩니다."
          >
             <div className="input-group">
              <input 
                type="number" 
                name="height"
                value={userInfo.height} 
                onChange={handleChange} 
                placeholder="000" 
                autoFocus
              />
              <span className="unit">cm</span>
            </div>
          </StepContent>
        );
      case 3:
        return (
          <StepContent 
            title="운동 난이도를 선택해주세요" 
            description="본인의 운동 수행 능력에 맞춰 선택해주세요."
          >
            <div className="selection-group">
              {[
                { code: 'L10', label: '초급', desc: '운동을 처음 시작해요' },
                { code: 'L20', label: '중급', desc: '기본적인 동작은 할 수 있어요' },
                { code: 'L30', label: '고급', desc: '전문적인 훈련이 필요해요' }
              ].map(level => (
                <button 
                  key={level.code}
                   className={`select-btn ${userInfo.levelCode === level.code ? 'selected' : ''}`}
                   onClick={() => setUserInfo(prev => ({ ...prev, levelCode: level.code }))}
                   style={{ height: 'auto', padding: '15px', flexDirection: 'column', gap: '5px'}}
                 >
                   <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{level.label}</span>
                   <span style={{ fontSize: '13px', opacity: 0.8 }}>{level.desc}</span>
                 </button>
               ))}
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => setShowHelper(!showHelper)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                본인의 실력이 어느정도인지 모르겠을때?
              </button>

              {showHelper && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '15px', 
                  background: 'var(--card-bg)', 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                    스쿼트 1RM(최대 중량)을 입력해보세요.<br/>
                    적절한 난이도를 추천해드립니다.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <input
                      type="number"
                      value={helperOneRm}
                      onChange={(e) => setHelperOneRm(e.target.value)}
                      placeholder="0"
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        width: '80px',
                        textAlign: 'center'
                      }}
                    />
                    <Button 
                      onClick={() => calculateLevel(helperOneRm)}
                      style={{ width: 'auto', padding: '0 15px', height: '40px', fontSize: '14px' }}
                    >
                      확인
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </StepContent>
        );
      case 4:
        return (
          <StepContent 
            title="주간 목표 운동 횟수" 
            description="꾸준함이 중요해요! 몇 번 도전할까요?"
          >
            <div className="selection-group">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <button 
                  key={num}
                  className={`select-btn ${userInfo.goalCount === num ? 'selected' : ''}`}
                  onClick={() => setUserInfo(prev => ({ ...prev, goalCount: num }))}
                >
                  주 {num}회
                </button>
              ))}
            </div>
          </StepContent>
        );
      case 5:
        return (
          <StepContent 
            title="계정 정보 입력" 
            description="로그인에 사용할 정보를 입력해주세요."
          >
            <div className="form-group" style={{ width: '100%', maxWidth: '300px' }}>
              <input 
                type="email" 
                name="email"
                className="text-input"
                value={userInfo.email} 
                onChange={handleChange} 
                placeholder="이메일 (예: user@example.com)" 
              />
              <input 
                type="password" 
                name="password"
                className="text-input"
                value={userInfo.password} 
                onChange={handleChange} 
                placeholder="비밀번호 (8자리 이상)" 
              />
              <input 
                type="text" 
                name="nickname"
                className="text-input"
                value={userInfo.nickname} 
                onChange={handleChange} 
                placeholder="닉네임" 
              />
            </div>
          </StepContent>
        );
      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
      </div>
      
      {renderStep()}

      <div className="bottom-action">
        <Button onClick={handleNext} disabled={isLoading}>
          {step === 5 ? (isLoading ? '처리중...' : '가입하기') : '다음'}
        </Button>
      </div>
    </div>
  );
};

const StepContent = ({ title, description, children }) => (
  <div className="step-content">
    <h2 className="step-title">{title}</h2>
    <p className="step-desc">{description}</p>
    <div className="step-body" style={{ flexDirection: 'column', alignItems: 'center' }}>
      {children}
    </div>
  </div>
);

export default Onboarding;
