# Python 기반 AI 서비스 실행 환경 설정
# slim 이미지를 사용하여 이미지 크기를 최소화합니다.
FROM python:3.9-slim

WORKDIR /app

# 라이브러리 설치를 위해 종속성 파일 먼저 복사 (캐시 활용 최적화)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 코드 전체 복사
COPY . .

# AI 서비스 실행 (main.py 호출)
CMD ["python", "main.py"]
