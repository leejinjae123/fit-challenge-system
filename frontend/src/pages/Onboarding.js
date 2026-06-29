import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import OnboardingService from '../services/OnboardingService';
import AuthService from '../services/AuthService';
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
    levelCode: 'L10',
    goalCount: 3,
    email: '',
    password: '',
    nickname: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    setIsLoading(true);
    try {
      await OnboardingService.submitUserInfo(userInfo);
      await AuthService.login(userInfo.email, userInfo.password);
      localStorage.setItem('isOnboarded', 'true');
      navigate('/');
    } catch (error) {
      console.error('Failed to submit onboarding data:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLevel = (oneRm) => {
    const weight = Number(oneRm);
    const levelCode = !oneRm || weight < 60 ? 'L10' : weight <= 120 ? 'L20' : 'L30';
    setUserInfo(prev => ({ ...prev, levelCode }));
    setShowHelper(false);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StepContent title="몸무게를 알려주세요" description="운동 강도와 추천 루틴을 맞추는 데 사용합니다.">
            <NumberInput name="weight" value={userInfo.weight} onChange={handleChange} unit="kg" placeholder="75" />
            <p style={styles.loginHint}>
              이미 계정이 있다면
              <button onClick={() => navigate('/login')} style={styles.inlineLink}>로그인</button>
            </p>
          </StepContent>
        );
      case 2:
        return (
          <StepContent title="키를 입력해주세요" description="기초 신체 정보로 더 적절한 운동량을 계산합니다.">
            <NumberInput name="height" value={userInfo.height} onChange={handleChange} unit="cm" placeholder="175" />
          </StepContent>
        );
      case 3:
        return (
          <StepContent title="운동 레벨을 선택하세요" description="현재 수행 능력에 가장 가까운 단계를 골라주세요.">
            <div className="selection-group">
              {[
                { code: 'L10', label: '초급', desc: '운동을 막 시작했어요' },
                { code: 'L20', label: '중급', desc: '기본 동작이 익숙해요' },
                { code: 'L30', label: '상급', desc: '고강도 훈련이 가능해요' }
              ].map(level => (
                <button
                  key={level.code}
                  className={`select-btn ${userInfo.levelCode === level.code ? 'selected' : ''}`}
                  onClick={() => setUserInfo(prev => ({ ...prev, levelCode: level.code }))}
                  style={styles.levelButton}
                >
                  <span style={styles.levelTitle}>{level.label}</span>
                  <span style={styles.levelDesc}>{level.desc}</span>
                </button>
              ))}
            </div>

            <button onClick={() => setShowHelper(!showHelper)} style={styles.helperToggle}>
              내 레벨을 모르겠어요
            </button>

            {showHelper && (
              <div style={styles.helperBox}>
                <p style={styles.helperText}>대표 운동 1RM을 kg로 입력하면 레벨을 추천합니다.</p>
                <div style={styles.helperInputRow}>
                  <input
                    type="number"
                    value={helperOneRm}
                    onChange={(event) => setHelperOneRm(event.target.value)}
                    placeholder="80"
                    className="text-input"
                    style={{ textAlign: 'center' }}
                  />
                  <Button onClick={() => calculateLevel(helperOneRm)} style={{ width: '92px' }}>확인</Button>
                </div>
              </div>
            )}
          </StepContent>
        );
      case 4:
        return (
          <StepContent title="주간 목표를 정하세요" description="꾸준히 지킬 수 있는 횟수를 선택하는 게 가장 좋습니다.">
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
          <StepContent title="계정 정보를 입력하세요" description="운동 계획과 기록을 저장할 계정입니다.">
            <div className="form-group" style={{ width: '100%' }}>
              <input type="email" name="email" className="text-input" value={userInfo.email} onChange={handleChange} placeholder="이메일" />
              <input type="password" name="password" className="text-input" value={userInfo.password} onChange={handleChange} placeholder="비밀번호" />
              <input type="text" name="nickname" className="text-input" value={userInfo.nickname} onChange={handleChange} placeholder="닉네임" />
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
        <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }} />
      </div>

      {renderStep()}

      <div className="bottom-action">
        <Button onClick={handleNext} disabled={isLoading}>
          {step === 5 ? (isLoading ? '처리 중...' : '시작하기') : '다음'}
        </Button>
      </div>
    </div>
  );
};

const NumberInput = ({ name, value, onChange, unit, placeholder }) => (
  <div className="input-group">
    <input type="number" name={name} value={value} onChange={onChange} placeholder={placeholder} autoFocus />
    <span className="unit">{unit}</span>
  </div>
);

const StepContent = ({ title, description, children }) => (
  <div className="step-content">
    <h2 className="step-title">{title}</h2>
    <p className="step-desc">{description}</p>
    <div className="step-body" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '18px' }}>
      {children}
    </div>
  </div>
);

const styles = {
  loginHint: {
    margin: '18px 0 0',
    color: 'var(--text-secondary)',
    fontSize: '14px',
  },
  inlineLink: {
    marginLeft: '8px',
    border: 'none',
    background: 'transparent',
    color: 'var(--primary-color)',
    fontWeight: '900',
    cursor: 'pointer',
  },
  levelButton: {
    minHeight: '104px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '6px',
  },
  levelTitle: {
    fontSize: '17px',
  },
  levelDesc: {
    fontSize: '12px',
    lineHeight: 1.35,
  },
  helperToggle: {
    marginTop: '4px',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontWeight: '700',
  },
  helperBox: {
    padding: '14px',
    borderRadius: '12px',
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
  },
  helperText: {
    margin: '0 0 10px',
    color: 'var(--text-secondary)',
    fontSize: '13px',
  },
  helperInputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '8px',
  }
};

export default Onboarding;
