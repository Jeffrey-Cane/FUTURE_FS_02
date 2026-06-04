# Dockerfile for full-stack deployment
# Builds the Vite frontend, then packages the backend with the built frontend assets.

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend

COPY frontend/package*.json ./
COPY frontend/vite.config.js ./
COPY frontend/postcss.config.js ./
COPY frontend/tailwind.config.js ./
COPY frontend/.env.example ./
COPY frontend/index.html ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN npm install
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production

COPY backend/src ./src
COPY backend/scripts ./scripts

COPY --from=frontend-build /app/frontend/dist ./frontend-dist

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/index.js"]
