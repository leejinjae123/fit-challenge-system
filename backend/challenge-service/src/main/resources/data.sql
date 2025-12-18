-- Common Groups
INSERT IGNORE INTO common_groups (group_code, group_name) VALUES ('LVL', '난이도');
INSERT IGNORE INTO common_groups (group_code, group_name) VALUES ('CAT', '운동유형');
INSERT IGNORE INTO common_groups (group_code, group_name) VALUES ('TGT', '자극부위');

-- Common Codes
-- Level
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L10', 'LVL', '초급', 1);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L20', 'LVL', '중급', 2);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('L30', 'LVL', '상급', 3);

-- Category
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_MB', 'CAT', '모빌리티/스트레칭', 1);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_ST', 'CAT', '근력', 2);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('C_CD', 'CAT', '유산소', 3);

-- Target
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_WH', 'TGT', '전신', 1);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_LG', 'TGT', '하체', 2);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_SH', 'TGT', '어깨', 3);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_BK', 'TGT', '등', 4);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_CR', 'TGT', '코어/복부', 5);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_CH', 'TGT', '가슴', 6);
INSERT IGNORE INTO common_codes (code_id, group_code, code_nm, sort_order) VALUES ('T_AR', 'TGT', '팔', 7);

-- Exercises
INSERT IGNORE INTO exercises (id, level_code, category_code, target_code, exercise_name, description, recommendation_score) VALUES 
(1, 'L10', 'C_MB', 'T_WH', '캣 카멜', '척추 분절 가동성 확보', 5),
(2, 'L10', 'C_MB', 'T_LG', '피존 스트레칭', '이상근 및 고관절 이완', 5),
(3, 'L10', 'C_MB', 'T_LG', '카프 스트레칭', '발목 가동성 및 종아리 유연성', 4),
(4, 'L10', 'C_MB', 'T_SH', '암 서클', '어깨 충돌 방지 및 회전근개 활성화', 5),
(5, 'L10', 'C_MB', 'T_BK', '오픈 북 스트레칭', '흉추 회전 가동성 증진', 5),
(6, 'L10', 'C_ST', 'T_LG', '맨몸 스쿼트', '하체 움직임 패턴 학습', 5),
(7, 'L10', 'C_ST', 'T_CR', '데드버그', '복부 심부 코어 강화', 5),
(8, 'L10', 'C_ST', 'T_CH', '니 푸쉬업', '상체 밀기 기초 근력', 4),
(9, 'L10', 'C_ST', 'T_CR', '플랭크', '전신 안정성 및 버티는 힘', 5),
(10, 'L10', 'C_ST', 'T_BK', '버드 독', '후면 사슬과 코어 협응력', 4),
(11, 'L10', 'C_ST', 'T_LG', '힙 브릿지', '둔근 활성화 및 골반 교정', 5),
(12, 'L10', 'C_ST', 'T_SH', 'Y-레이즈', '하부 승모근 및 견갑 안정화', 4),
(13, 'L10', 'C_MB', 'T_SH', '벽 가슴 스트레칭', '굽은 등 펴기 및 대흉근 이완', 4),
(14, 'L10', 'C_ST', 'T_BK', '인버티드 로우', '자기 체중을 이용한 기초 등 운동', 4),
(15, 'L10', 'C_MB', 'T_WH', '차일드 포즈', '등 하부 및 어깨 휴식/이완', 3),
(16, 'L10', 'C_CD', 'T_WH', '패스트 워킹', '심폐 지구력 기초 쌓기', 5),
(17, 'L10', 'C_CD', 'T_WH', '슬로우 조깅', '관절 무리 없는 유산소 적응', 4),
(18, 'L10', 'C_CD', 'T_WH', '고정 사이클', '하체 혈류 개선 및 기초 대사', 3),
(19, 'L10', 'C_ST', 'T_LG', '스플릿 스쿼트 기초', '하체 밸런스 및 발바닥 접지력', 4),
(20, 'L10', 'C_MB', 'T_LG', '코브라 스트레칭', '복부 이완 및 척추 신전', 3),
(21, 'L20', 'C_ST', 'T_LG', '바벨 백 스쿼트', '하체 전체 근질량 증가', 5),
(22, 'L20', 'C_ST', 'T_CH', '벤치 프레스', '가슴 근육 두께 형성', 5),
(23, 'L20', 'C_ST', 'T_BK', '바벨 로우', '등 근육 전체 볼륨', 5),
(24, 'L20', 'C_ST', 'T_SH', '오버헤드 프레스', '어깨 전체 프레임 확장', 5),
(25, 'L20', 'C_ST', 'T_BK', '렛풀다운', '광배근 너비 및 V-테이퍼', 5),
(26, 'L20', 'C_ST', 'T_CH', '덤벨 벤치 프레스', '가슴 근육 가동범위 및 균형', 4),
(27, 'L20', 'C_ST', 'T_LG', '레그 프레스', '허리 부담 적은 하체 고강도 훈련', 4),
(28, 'L20', 'C_ST', 'T_LG', '레그 컬', '햄스트링 고립 발달', 5),
(29, 'L20', 'C_ST', 'T_SH', '사이드 레터럴 레이즈', '측면 삼각근 볼륨 형성', 5),
(30, 'L20', 'C_ST', 'T_AR', '바벨 컬', '상완이두근 크기 증대', 4),
(31, 'L20', 'C_ST', 'T_AR', '트라이셉스 푸쉬다운', '상완삼두근 선명도', 4),
(32, 'L20', 'C_ST', 'T_LG', '루마니안 데드리프트', '후면 사슬 전체 근비대', 5),
(33, 'L20', 'C_ST', 'T_CH', '인클라인 덤벨 프레스', '상부 가슴 집중 발달', 4),
(34, 'L20', 'C_ST', 'T_BK', '시티드 로우', '등 중앙부 두께감 및 견갑 수축', 4),
(35, 'L20', 'C_ST', 'T_SH', '업라이트 로우', '측면 어깨 및 상부 승모근', 3),
(36, 'L20', 'C_CD', 'T_WH', '인터벌 러닝', '강도 높은 지방 연소', 5),
(37, 'L20', 'C_CD', 'T_WH', '일립티컬', '전신 유산소 및 관절 보호', 4),
(38, 'L20', 'C_ST', 'T_CR', '행잉 레그 레이즈', '복근 하부 강도 증대', 5),
(39, 'L20', 'C_ST', 'T_CR', '케이블 크런치', '복근의 입체감 형성', 4),
(40, 'L20', 'C_CD', 'T_WH', '줄넘기', '민첩성 및 기초 체력 강화', 3),
(41, 'L30', 'C_ST', 'T_WH', '컨벤셔널 데드리프트', '전신 협응력 및 고중량 스트렝스', 5),
(42, 'L30', 'C_ST', 'T_BK', '중량 풀업', '광배근 한계 돌파', 5),
(43, 'L30', 'C_ST', 'T_LG', '불가리안 스플릿 스쿼트', '둔근 및 하체 편측 고립', 5),
(44, 'L30', 'C_ST', 'T_CH', '중량 딥스', '아랫 가슴 및 삼두 고중량', 5),
(45, 'L30', 'C_ST', 'T_SH', '페이스 풀', '후면 삼각근 및 상체 자세 교정', 5),
(46, 'L30', 'C_ST', 'T_LG', '프론트 스쿼트', '대퇴사두 전면부 타겟 및 코어', 4),
(47, 'L30', 'C_ST', 'T_BK', '원 암 덤벨 로우', '등 근육 가동범위 끝까지 수축', 4),
(48, 'L30', 'C_ST', 'T_SH', '아놀드 프레스', '어깨 삼각근 전체의 회전 자극', 4),
(49, 'L30', 'C_ST', 'T_CH', '케이블 크로스 오버', '가슴 안쪽 및 하부 분리도', 4),
(50, 'L30', 'C_ST', 'T_BK', 'T-바 로우', '등 중앙 승모근 두께 극대화', 4),
(51, 'L30', 'C_ST', 'T_LG', '핵 스쿼트', '하체 바깥쪽 근육 선명도', 4),
(52, 'L30', 'C_ST', 'T_SH', '벤트오버 레터럴 레이즈', '후면 어깨 독립 고립', 5),
(53, 'L30', 'C_ST', 'T_CR', '드래곤 플래그', '복부 코어의 정점 훈련', 5),
(54, 'L30', 'C_ST', 'T_AR', '해머 컬 (드롭셋)', '전완근 및 이두 볼륨 극대화', 3),
(55, 'L30', 'C_ST', 'T_LG', '스티프 레그 데드리프트', '햄스트링 극한의 이완 유도', 4),
(56, 'L30', 'C_CD', 'T_WH', '천국의 계단 (스텝밀)', '고강도 하체 유산소 챌린지', 5),
(57, 'L30', 'C_CD', 'T_WH', '로잉 머신 (스프린트)', '전신 파워 및 유산소 동시 공략', 5),
(58, 'L30', 'C_CD', 'T_WH', '버피 테스트 (푸쉬업 포함)', '심박수 폭발 및 전신 컨디셔닝', 4),
(59, 'L30', 'C_ST', 'T_CH', '덤벨 풀오버', '흉곽 확장 및 가슴/등 복합 자극', 3),
(60, 'L30', 'C_ST', 'T_CR', '러시안 트위스트 (중량)', '외복사근 및 회전 파워', 4);


