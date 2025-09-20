FROM python:3.11-slim

WORKDIR /app
RUN apt-get update && apt-get install -y netcat-openbsd

COPY predictor_service/. .
COPY .env .env

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]