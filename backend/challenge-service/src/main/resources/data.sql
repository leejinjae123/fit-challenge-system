-- Common Groups
INSERT INTO common_groups (group_code, group_name) VALUES ('LVL', '난이도') ON DUPLICATE KEY UPDATE group_name = VALUES(group_name);
INSERT INTO common_groups (group_code, group_name) VALUES ('CAT', '운동유형') ON DUPLICATE KEY UPDATE group_name = VALUES(group_name);
INSERT INTO common_groups (group_code, group_name) VALUES ('TGT', '자극부위') ON DUPLICATE KEY UPDATE group_name = VALUES(group_name);

-- Common Codes
-- Level
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L10', 'LVL', '초급', 1) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L20', 'LVL', '중급', 2) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L30', 'LVL', '상급', 3) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);

-- Category
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_MB', 'CAT', '모빌리티/스트레칭', 1) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_ST', 'CAT', '근력', 2) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_CD', 'CAT', '유산소', 3) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);

-- Target
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_WH', 'TGT', '전신', 1) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_LG', 'TGT', '하체', 2) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_SH', 'TGT', '어깨', 3) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_BK', 'TGT', '등', 4) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_CR', 'TGT', '코어/복부', 5) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_CH', 'TGT', '가슴', 6) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);
INSERT INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_AR', 'TGT', '팔', 7) ON DUPLICATE KEY UPDATE code_nm = VALUES(code_nm), sort_order = VALUES(sort_order);

-- Exercises
SET @exercise_image_base = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/';

INSERT INTO exercises (id, level_code, category_code, target_code, exercise_name, description, recommendation_score, image_url) VALUES
(1, 'L10', 'C_ST', 'T_CH', '푸쉬업', '가슴과 삼두, 코어를 함께 쓰는 기본 상체 밀기 운동', 5, CONCAT(@exercise_image_base, 'Push-ups-3-2.png')),
(2, 'L10', 'C_ST', 'T_LG', '박스 스쿼트', '벤치 높이를 기준으로 앉았다 일어나며 스쿼트 자세를 익히는 운동', 5, CONCAT(@exercise_image_base, 'Squat-to-bench-2-865x1024.png')),
(3, 'L10', 'C_ST', 'T_LG', '런지', '한 발씩 내딛으며 둔근과 대퇴사두근의 균형을 기르는 운동', 5, CONCAT(@exercise_image_base, 'Lunges-2.png')),
(4, 'L10', 'C_CD', 'T_LG', '스텝 업', '높은 발판에 올라서며 하체 근력과 심폐 지구력을 함께 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Step-ups-3-801x1024.png')),
(5, 'L10', 'C_ST', 'T_LG', '스탠딩 카프 레이즈', '발뒤꿈치를 들어 올려 종아리 근육을 수축하는 운동', 4, CONCAT(@exercise_image_base, 'Calf-raises-2.png')),
(6, 'L10', 'C_ST', 'T_CR', '사이드 플랭크', '옆으로 버티며 복사근과 측면 코어 안정성을 강화하는 운동', 5, CONCAT(@exercise_image_base, 'Side-plank-2.png')),
(7, 'L10', 'C_ST', 'T_CR', '벤트 니 힙 레이즈', '무릎을 굽힌 채 골반을 말아 올려 하복부를 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Bent-knee-hip-raise-2.png')),
(8, 'L10', 'C_ST', 'T_BK', '슈퍼맨', '엎드린 자세에서 팔다리를 들어 척추기립근과 둔근을 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Supermans-2.png')),
(9, 'L10', 'C_ST', 'T_BK', '짐볼 백 익스텐션', '짐볼 위에서 상체를 들어 허리 뒤쪽 근육을 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Back-extension-on-stability-ball-2.png')),
(10, 'L10', 'C_ST', 'T_SH', '덤벨 레터럴 레이즈', '덤벨을 옆으로 들어 측면 삼각근을 자극하는 어깨 운동', 5, CONCAT(@exercise_image_base, 'Dumbbell-lateral-raises-2.png')),
(11, 'L10', 'C_ST', 'T_SH', '덤벨 프론트 레이즈', '덤벨을 앞으로 들어 전면 삼각근을 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Dumbbell-front-raises-2.png')),
(12, 'L10', 'C_ST', 'T_SH', '덤벨 숄더 프레스', '덤벨을 머리 위로 밀어 어깨 전반과 삼두를 쓰는 운동', 5, CONCAT(@exercise_image_base, 'Dumbbell-shoulder-press-2.png')),
(13, 'L10', 'C_ST', 'T_BK', '시티드 케이블 로우', '케이블을 몸쪽으로 당겨 등 중앙과 광배근을 수축하는 운동', 5, CONCAT(@exercise_image_base, 'Cable-seated-rows-2.png')),
(14, 'L10', 'C_ST', 'T_BK', '클로즈 그립 랫풀다운', '좁은 그립으로 바를 당겨 광배근 아래쪽을 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Close-grip-front-lat-pull-down-2.png')),
(15, 'L10', 'C_ST', 'T_LG', '레그 익스텐션', '무릎을 펴며 대퇴사두근을 고립해서 강화하는 머신 운동', 4, CONCAT(@exercise_image_base, 'Leg-extensions-2-672x1024.png')),
(16, 'L10', 'C_ST', 'T_LG', '시티드 레그 컬', '앉은 자세에서 무릎을 굽혀 햄스트링을 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Seated-leg-curl-2.png')),
(17, 'L10', 'C_ST', 'T_LG', '레그 프레스', '발판을 밀어 하체 전반을 안정적으로 강화하는 머신 운동', 5, CONCAT(@exercise_image_base, 'Leg-press-2-1024x670.png')),
(18, 'L10', 'C_ST', 'T_AR', '드래그 컬', '바를 몸에 가깝게 끌어 올려 이두근을 집중 자극하는 운동', 3, CONCAT(@exercise_image_base, 'Drag-curl-2.png')),
(19, 'L10', 'C_ST', 'T_AR', '라잉 트라이셉스 익스텐션', '누운 자세에서 팔꿈치를 펴 삼두근을 고립하는 운동', 3, CONCAT(@exercise_image_base, 'Decline-triceps-extension-2.png')),
(20, 'L10', 'C_ST', 'T_CH', '펙덱 플라이', '머신 손잡이를 모아 가슴 안쪽 수축감을 익히는 운동', 4, CONCAT(@exercise_image_base, 'Butterfly-machine-2.png')),
(21, 'L20', 'C_ST', 'T_CH', '벤치 프레스', '바벨을 가슴 위에서 밀어 대흉근과 삼두를 강화하는 대표 운동', 5, CONCAT(@exercise_image_base, 'Bench-press-2.png')),
(22, 'L20', 'C_ST', 'T_CH', '인클라인 체스트 프레스', '기울어진 벤치 각도로 상부 가슴을 집중 자극하는 운동', 5, CONCAT(@exercise_image_base, 'Incline-chest-press-2.png')),
(23, 'L20', 'C_ST', 'T_CH', '해머 그립 인클라인 프레스', '중립 그립으로 상부 가슴과 전면 어깨를 함께 쓰는 프레스', 4, CONCAT(@exercise_image_base, 'Hammer-grip-incline-bench-press-2.png')),
(24, 'L20', 'C_ST', 'T_CH', '덤벨 플라이', '팔을 벌렸다 모아 가슴의 신장과 수축을 만드는 운동', 4, CONCAT(@exercise_image_base, 'Dumbbell-flys-2.png')),
(25, 'L20', 'C_ST', 'T_CH', '케이블 크로스오버', '양쪽 케이블을 모아 가슴 안쪽과 하부 라인을 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Cable-crossover-2.png')),
(26, 'L20', 'C_ST', 'T_BK', '바벨 리어 델트 로우', '상체를 숙여 바벨을 당기며 등과 후면 어깨를 강화하는 운동', 5, CONCAT(@exercise_image_base, 'Barbell-rear-delt-row-2.png')),
(27, 'L20', 'C_ST', 'T_BK', 'T바 로우', '몸통을 고정하고 바를 당겨 등 중앙 두께를 만드는 운동', 5, CONCAT(@exercise_image_base, 'T-bar-row-2.png')),
(28, 'L20', 'C_ST', 'T_BK', 'V바 랫풀다운', 'V바를 가슴 쪽으로 당겨 광배근 수축을 익히는 운동', 5, CONCAT(@exercise_image_base, 'V-bar-pull-down-2.png')),
(29, 'L20', 'C_ST', 'T_BK', '언더핸드 풀다운', '손바닥이 몸을 향한 그립으로 광배근 하부를 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Underhand-pull-downs-2.png')),
(30, 'L20', 'C_ST', 'T_SH', '바벨 업라이트 로우', '바벨을 몸 가까이 끌어 올려 측면 어깨와 승모근을 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Barbell-upright-rows-2.png')),
(31, 'L20', 'C_ST', 'T_SH', '아놀드 프레스', '회전 동작을 포함해 어깨 전면과 측면을 함께 자극하는 프레스', 4, CONCAT(@exercise_image_base, 'Arnold-press-2.png')),
(32, 'L20', 'C_ST', 'T_SH', '시티드 밀리터리 프레스', '앉은 자세에서 중량을 머리 위로 밀어 어깨 힘을 키우는 운동', 5, CONCAT(@exercise_image_base, 'Seated-military-shoulder-press-2.png')),
(33, 'L20', 'C_ST', 'T_SH', '바벨 프론트 레이즈', '바벨을 앞으로 들어 전면 삼각근을 집중 자극하는 운동', 3, CONCAT(@exercise_image_base, 'Barbell-front-raises-2.png')),
(34, 'L20', 'C_ST', 'T_LG', '핵 스쿼트', '고정된 궤도에서 대퇴사두근과 둔근을 강하게 쓰는 운동', 5, CONCAT(@exercise_image_base, 'Hack-squat-2-2-768x1024.png')),
(35, 'L20', 'C_ST', 'T_LG', '내로우 스탠스 레그 프레스', '좁은 발 간격으로 허벅지 앞쪽 자극을 높이는 레그 프레스', 4, CONCAT(@exercise_image_base, 'Narrow-stance-leg-press-2-1024x671.png')),
(36, 'L20', 'C_ST', 'T_LG', '스탠딩 레그 컬', '서서 한쪽 무릎을 굽혀 햄스트링을 고립하는 운동', 4, CONCAT(@exercise_image_base, 'Standing-leg-curl-2.png')),
(37, 'L20', 'C_ST', 'T_LG', '동키 카프 레이즈', '상체를 숙인 자세에서 종아리 수축 범위를 크게 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Donkey-calf-raises-2.png')),
(38, 'L20', 'C_ST', 'T_AR', '크로스 바디 해머 컬', '덤벨을 반대쪽 어깨 방향으로 들어 전완과 상완요골근을 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Cross-body-hammer-curl-2.png')),
(39, 'L20', 'C_ST', 'T_AR', '디클라인 EZ바 트라이셉스 익스텐션', '기울어진 벤치에서 삼두 장두를 길게 늘려 자극하는 운동', 4, CONCAT(@exercise_image_base, 'Decline-ez-bar-triceps-extension-2.png')),
(40, 'L20', 'C_ST', 'T_CR', '니링 앱 롤아웃', '무릎을 대고 롤러를 밀어 복부와 전신 코어를 강화하는 운동', 5, CONCAT(@exercise_image_base, 'Ab-rollout-on-knees-2.png')),
(41, 'L30', 'C_ST', 'T_CH', '인클라인 프레스', '상부 가슴에 높은 부하를 주는 고강도 프레스 운동', 5, CONCAT(@exercise_image_base, 'Incline-press-2.png')),
(42, 'L30', 'C_ST', 'T_CH', '내로우 그립 벤치 프레스', '좁은 그립으로 가슴 안쪽과 삼두 부하를 높이는 벤치 프레스', 4, CONCAT(@exercise_image_base, 'Narrow-grip-bench-press-2.png')),
(43, 'L30', 'C_ST', 'T_CH', '원암 벤치 프레스', '한쪽 팔로 중량을 밀어 가슴과 코어 안정성을 함께 요구하는 운동', 4, CONCAT(@exercise_image_base, 'One-arm-bench-press-2.png')),
(44, 'L30', 'C_ST', 'T_CH', '원암 플로어 프레스', '바닥에서 한쪽 팔로 눌러 가슴과 삼두의 잠금 힘을 기르는 운동', 4, CONCAT(@exercise_image_base, 'One-arm-floor-press-2.png')),
(45, 'L30', 'C_ST', 'T_CH', '와이드 그립 디클라인 풀오버', '가슴과 광배근을 동시에 늘리고 수축하는 고난도 풀오버', 4, CONCAT(@exercise_image_base, 'Wide-grip-decline-pullover-2.png')),
(46, 'L30', 'C_ST', 'T_BK', '리버스 그립 벤트오버 로우', '언더그립으로 바벨을 당겨 광배근과 등 중앙을 강화하는 운동', 5, CONCAT(@exercise_image_base, 'Reverse-grip-bent-over-rows-2.png')),
(47, 'L30', 'C_ST', 'T_BK', '내로우 패러럴 그립 친업', '좁은 중립 그립으로 몸을 끌어올려 광배근과 이두를 쓰는 운동', 5, CONCAT(@exercise_image_base, 'Narrow-parallel-grip-chin-ups-2.png')),
(48, 'L30', 'C_ST', 'T_BK', '스트레이트 암 푸쉬다운', '팔을 편 상태로 케이블을 내려 광배근 수축을 고립하는 운동', 4, CONCAT(@exercise_image_base, 'Straight-arm-push-down-2.png')),
(49, 'L30', 'C_ST', 'T_SH', '헤드 서포트 리어 델트 로우', '벤치에 머리를 지지하고 후면 어깨와 등 상부를 당기는 운동', 4, CONCAT(@exercise_image_base, 'Bent-over-rear-delt-row-with-head-on-bench-2.png')),
(50, 'L30', 'C_ST', 'T_SH', '쿠반 프레스', '외회전과 프레스를 결합해 회전근개와 어깨 안정성을 높이는 운동', 4, CONCAT(@exercise_image_base, 'Cuban-press-2.png')),
(51, 'L30', 'C_ST', 'T_LG', '핵 스쿼트 고중량', '고정 궤도에서 깊게 내려가 대퇴사두근을 강하게 자극하는 운동', 5, CONCAT(@exercise_image_base, 'Hack-squat-2-856x1024.png')),
(52, 'L30', 'C_ST', 'T_LG', '제퍼슨 스쿼트', '바벨을 다리 사이에 두고 들어 올려 하체와 코어를 함께 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Jefferson-squats-2-413x1024.png')),
(53, 'L30', 'C_ST', 'T_LG', '싱글 레그 스쿼트', '한쪽 다리로 앉았다 일어나며 균형과 하체 힘을 요구하는 운동', 5, CONCAT(@exercise_image_base, 'Single-leg-squat-2-877x1024.png')),
(54, 'L30', 'C_ST', 'T_LG', '사이드 스플릿 스쿼트', '옆으로 넓게 벌린 자세에서 내전근과 둔근을 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Side-split-squats-2-1024x600.png')),
(55, 'L30', 'C_ST', 'T_LG', '굿모닝', '상체를 숙였다 펴며 햄스트링과 척추기립근을 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Good-mornings-2.png')),
(56, 'L30', 'C_ST', 'T_LG', '라잉 스쿼트', '누운 머신 자세에서 발판을 밀어 하체를 강하게 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Lying-squat-2-990x1024.png')),
(57, 'L30', 'C_ST', 'T_CR', '앱 롤아웃', '롤러를 멀리 밀었다 당기며 복부와 광배, 전신 안정성을 요구하는 운동', 5, CONCAT(@exercise_image_base, 'Ab-rollout-2.png')),
(58, 'L30', 'C_CD', 'T_CR', '플러터 킥', '다리를 교차로 차며 하복부와 고관절 굴곡근을 지속적으로 쓰는 운동', 4, CONCAT(@exercise_image_base, 'Flutter-kicks-2.png')),
(59, 'L30', 'C_ST', 'T_CR', '레그 레이즈', '다리를 들어 올려 하복부와 골반 후방 경사를 강화하는 운동', 4, CONCAT(@exercise_image_base, 'Leg-raises-2.png')),
(60, 'L30', 'C_ST', 'T_CR', '포인트 드로잉 인', '네발기기 자세에서 복부를 당겨 깊은 코어 안정성을 훈련하는 운동', 3, CONCAT(@exercise_image_base, 'Abdominal-4-point-drawing-in-2.png'))
ON DUPLICATE KEY UPDATE
    level_code = VALUES(level_code),
    category_code = VALUES(category_code),
    target_code = VALUES(target_code),
    exercise_name = VALUES(exercise_name),
    description = VALUES(description),
    recommendation_score = VALUES(recommendation_score),
    image_url = VALUES(image_url);
