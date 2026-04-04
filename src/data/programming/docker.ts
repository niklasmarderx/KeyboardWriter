import { CodeSnippet } from './types';

// Docker/YAML Snippets
export const DOCKER_SNIPPETS: CodeSnippet[] = [
  {
    id: 'docker-basic',
    language: 'dockerfile',
    title: 'Basic Dockerfile',
    code: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000
CMD ["node", "server.js"]`,
    difficulty: 'beginner',
  },
  {
    id: 'docker-multistage',
    language: 'dockerfile',
    title: 'Multi-Stage Build',
    code: `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-compose',
    language: 'yaml',
    title: 'Docker Compose',
    code: `version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgres://db:5432/app
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=secret

volumes:
  postgres_data:`,
    difficulty: 'intermediate',
  },
  {
    id: 'docker-compose-full',
    language: 'yaml',
    title: 'Docker Compose Full Stack',
    code: `version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: secret
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 5s
      timeout: 5s
      retries: 5

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:`,
    difficulty: 'advanced',
    description: 'Full-stack Docker Compose with healthchecks',
  },
  {
    id: 'docker-compose-override',
    language: 'yaml',
    title: 'Docker Compose Override',
    code: `# docker-compose.override.yml (dev overrides)
version: '3.8'

services:
  api:
    command: npm run dev
    environment:
      - DEBUG=*
      - LOG_LEVEL=debug
    ports:
      - "9229:9229"  # Node.js debugger

  db:
    ports:
      - "5432:5432"  # Expose for local tools

  adminer:
    image: adminer
    ports:
      - "8080:8080"`,
    difficulty: 'intermediate',
    description: 'Environment-specific overrides',
  },
];
