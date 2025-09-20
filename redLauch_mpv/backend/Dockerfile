# Build Node.js backend
FROM node:20-alpine AS node-backend

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --production
COPY src/ ./src
COPY .env ./

# Build Python predictor service
FROM python:3.11-slim AS python-predictor

WORKDIR /predictor_service
COPY predictor_service/ ./predictor_service
RUN pip install --no-cache-dir -r predictor_service/requirements.txt

# Final image for Node.js backend only
FROM node:20-alpine

WORKDIR /app
COPY --from=node-backend /app ./

EXPOSE 3001

CMD ["npm", "start"]