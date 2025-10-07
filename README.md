# คู่มือพัฒนาซอฟต์แวร์ครบวงจร
*การพัฒนา Deploy และจัดการ Code ด้วย Cursor, GitHub, Digital Ocean และ Cloudflare*

---

## สารบัญ
1. [การตั้งค่าเริ่มต้น](#1-การตั้งค่าเริ่มต้น)
2. [โครงสร้างโปรเจค](#2-โครงสร้างโปรเจค)
3. [Git Workflow และการป้องกันโค้ดทับกัน](#3-git-workflow-และการป้องกันโค้ดทับกัน)
4. [การกู้คืนโค้ด](#4-การกู้คืนโค้ด)
5. [การตั้งค่า Digital Ocean](#5-การตั้งค่า-digital-ocean)
6. [การใช้งาน Cloudflare](#6-การใช้งาน-cloudflare)
7. [Continuous Integration/Continuous Deployment](#7-cicd-pipeline)
8. [Docker และ Container Management](#8-docker-และ-container-management)
9. [Monitoring และ Security](#9-monitoring-และ-security)
10. [Best Practices และ Troubleshooting](#10-best-practices-และ-troubleshooting)

---

## 1. การตั้งค่าเริ่มต้น

### 1.1 ติดตั้ง Tools ที่จำเป็น

#### Local Development
```bash
# ติดตั้ง Git
# Windows: ดาวน์โหลดจาก https://git-scm.com/
# macOS: brew install git
# Linux: sudo apt install git

# ติดตั้ง Node.js และ npm
# ดาวน์โหลดจาก https://nodejs.org/

# ติดตั้ง Docker Desktop
# ดาวน์โหลดจาก https://www.docker.com/products/docker-desktop/

# ติดตั้ง Cursor
# ดาวน์โหลดจาก https://cursor.sh/
```

#### การตั้งค่า Git
```bash
# ตั้งค่าข้อมูลผู้ใช้
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# ตั้งค่า Default Editor
git config --global core.editor "code --wait"  # สำหรับ VSCode
# หรือ git config --global core.editor "cursor --wait"  # สำหรับ Cursor

# ตั้งค่า Default Branch
git config --global init.defaultBranch main

# ตั้งค่า SSH Key สำหรับ GitHub
ssh-keygen -t ed25519 -C "your.email@example.com"
cat ~/.ssh/id_ed25519.pub  # Copy public key ไปใส่ใน GitHub
```

### 1.2 สร้าง Accounts ที่จำเป็น
- **GitHub Account**: https://github.com
- **Digital Ocean Account**: https://digitalocean.com
- **Cloudflare Account**: https://cloudflare.com
- **Domain Registration**: Namecheap, GoDaddy หรือ Google Domains

---

## 2. โครงสร้างโปรเจค

### 2.1 โครงสร้างไฟล์มาตรฐาน

```
project-name/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   └── security.yml
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── .vscode/
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── nginx/
│       └── nginx.conf
├── docs/
│   ├── README.md
│   ├── API.md
│   ├── CONTRIBUTING.md
│   └── DEPLOYMENT.md
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── pages/
│   ├── hooks/
│   ├── utils/
│   ├── services/
│   ├── contexts/
│   ├── types/
│   └── config/
├── public/
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── tests/
│   ├── __mocks__/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/
│   ├── build.sh
│   ├── deploy.sh
│   └── backup.sh
├── .env.example
├── .env.local
├── .gitignore
├── .dockerignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── jest.config.js
├── tailwind.config.js
└── README.md
```

### 2.2 ไฟล์ Configuration สำคัญ

#### .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
build/
dist/
out/
.next/

# IDE files
.vscode/settings.json
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Coverage reports
coverage/

# Docker
*.tar
```

#### package.json (ตัวอย่าง)
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "description": "Project description",
  "main": "src/index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "type-check": "tsc --noEmit",
    "prepare": "husky install",
    "docker:build": "docker build -t your-app .",
    "docker:run": "docker run -p 3000:3000 your-app"
  },
  "dependencies": {
    "next": "^13.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "@types/node": "^18.0.0",
    "@types/react": "^18.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^13.0.0",
    "husky": "^8.0.0",
    "jest": "^29.0.0",
    "lint-staged": "^13.0.0",
    "prettier": "^2.8.0",
    "typescript": "^4.9.0"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run test && npm run type-check"
    }
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

---

## 3. Git Workflow และการป้องกันโค้ดทับกัน

### 3.1 Git Flow Strategy

#### Main Branches
```bash
main/master     # Production-ready code
develop         # Integration branch
staging         # Pre-production testing
```

#### Supporting Branches
```bash
feature/*       # New features
bugfix/*        # Bug fixes
hotfix/*        # Emergency fixes
release/*       # Release preparation
```

### 3.2 ขั้นตอนการทำงานแบบทีม

#### การเริ่มต้นโปรเจค
```bash
# 1. สร้าง Repository ใน GitHub
# 2. Clone ลงเครื่อง local
git clone https://github.com/username/project-name.git
cd project-name

# 3. ตั้งค่า upstream (สำหรับ Fork)
git remote add upstream https://github.com/original/project-name.git

# 4. สร้าง develop branch
git checkout -b develop
git push origin develop
```

#### การทำงานกับ Features
```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. สร้าง feature branch
git checkout -b feature/user-authentication

# 3. ทำงานและ commit
git add .
git commit -m "feat: implement user login system

- Add login component
- Create authentication service
- Add JWT token handling
- Update user state management"

# 4. Push feature branch
git push origin feature/user-authentication

# 5. สร้าง Pull Request ใน GitHub
# 6. รอ Code Review
# 7. Merge เข้า develop
```

#### การจัดการ Conflicts
```bash
# เมื่อเกิด conflict ขณะ merge
git status  # ดูไฟล์ที่ conflict

# แก้ไขไฟล์ที่ conflict
# ลบ markers: <<<<<<< HEAD, =======, >>>>>>> branch-name
# เลือกโค้ดที่ต้องการหรือรวมกัน

# หลังแก้เสร็จ
git add .
git commit -m "resolve: merge conflict in user authentication"
```

### 3.3 Protected Branches Setup

#### ใน GitHub Repository Settings
```yaml
Branch Protection Rules:
Branch name pattern: main
☑️ Restrict pushes that create files
☑️ Require a pull request before merging
☑️ Require status checks to pass before merging
☑️ Require branches to be up to date before merging
☑️ Require conversation resolution before merging
☑️ Restrict force pushes
☑️ Include administrators
```

### 3.4 Commit Message Standards
```bash
# Format: type(scope): description
feat(auth): add user login functionality
fix(api): resolve database connection timeout
docs(readme): update installation instructions
style(css): fix button styling inconsistencies
refactor(utils): optimize helper functions
test(unit): add user service test cases
chore(deps): update dependencies to latest versions

# Breaking changes
feat!: change API response format
BREAKING CHANGE: user object structure modified
```

---

## 4. การกู้คืนโค้ด

### 4.1 Git History และ Reflog

#### ดูประวัติ Commits
```bash
# ดูประวัติแบบสั้น
git log --oneline

# ดูประวัติแบบ graph
git log --graph --oneline --all

# ดูประวัติของไฟล์เฉพาะ
git log --follow path/to/file.js

# ดูการเปลี่ยนแปลงในแต่ละ commit
git log -p
```

#### การใช้ Git Reflog
```bash
# ดูประวัติการกระทำทั้งหมด
git reflog

# ตัวอย่างผลลัพธ์:
# a1b2c3d HEAD@{0}: commit: latest changes
# e4f5g6h HEAD@{1}: merge: merge feature branch
# i7j8k9l HEAD@{2}: commit: working version
# m8n9o0p HEAD@{3}: reset: moving to HEAD~1

# กู้คืนจาก reflog
git reset --hard HEAD@{2}
```

### 4.2 การกู้คืนในสถานการณ์ต่างๆ

#### กู้คืนไฟล์ที่ถูกลบ
```bash
# หาไฟล์ที่ถูกลบ
git log --diff-filter=D --summary | grep delete

# กู้คืนไฟล์จาก commit ก่อนหน้า
git checkout HEAD~1 -- path/to/deleted-file.js

# หรือจาก commit เฉพาะ
git checkout a1b2c3d -- path/to/deleted-file.js
```

#### กู้คืน Branch ที่ถูกลบ
```bash
# หา commit hash ของ branch ที่ถูกลบ
git reflog --all | grep "branch-name"

# สร้าง branch ใหม่จาก commit hash
git checkout -b recovered-branch a1b2c3d
```

#### ยกเลิก Commit
```bash
# ยกเลิก commit ล่าสุด (เก็บการเปลี่ยนแปลงไว้)
git reset --soft HEAD~1

# ยกเลิก commit และการเปลี่ยนแปลง
git reset --hard HEAD~1

# สร้าง revert commit
git revert HEAD
```

#### กู้คืนจาก GitHub Web Interface
```bash
# 1. ไปที่ Repository บน GitHub
# 2. Browse ไปยัง commit ที่ต้องการ
# 3. กด "Browse files" ที่ commit นั้น
# 4. หา file ที่ต้องการ
# 5. Copy content มาใช้

# หรือใช้ GitHub CLI
gh repo clone username/repository
cd repository
git checkout commit-hash -- path/to/file
```

### 4.3 Advanced Recovery Techniques

#### การใช้ Cherry-pick
```bash
# นำ commit เฉพาะมาใช้
git cherry-pick a1b2c3d

# นำหลาย commits มาใช้
git cherry-pick a1b2c3d..e4f5g6h

# Cherry-pick แต่ไม่ commit
git cherry-pick --no-commit a1b2c3d
```

#### การใช้ Git Stash
```bash
# เก็บการเปลี่ยนแปลงชั่วคราว
git stash save "work in progress"

# ดู stash list
git stash list

# กู้คืนจาก stash
git stash apply stash@{0}
git stash pop  # apply และลบ stash

# ลบ stash
git stash drop stash@{0}
```

---

## 5. การตั้งค่า Digital Ocean

### 5.1 การสร้าง Droplet

#### ขั้นตอนการสร้าง Droplet
```bash
# 1. เลือก Image: Ubuntu 22.04 LTS
# 2. เลือก Size: ขึ้นอยู่กับความต้องการ
#    - Basic: $6/month (1GB RAM, 1 vCPU)
#    - Standard: $12/month (2GB RAM, 1 vCPU)
#    - CPU-Optimized: สำหรับแอปที่ใช้ CPU สูง
# 3. เลือก Region: Singapore (ใกล้ Thailand)
# 4. Authentication: SSH Key (แนะนำ)
# 5. Add Monitoring
```

#### การเข้าถึง Droplet
```bash
# เข้าผ่าน SSH
ssh root@your-server-ip

# หรือถ้าใช้ user อื่น
ssh username@your-server-ip -i ~/.ssh/private_key
```

### 5.2 ตั้งค่าเบื้องต้นของ Server

#### อัพเดทระบบ
```bash
# อัพเดท package list
sudo apt update
sudo apt upgrade -y

# ติดตั้งของจำเป็น
sudo apt install -y curl wget git htop unzip software-properties-common
```

#### สร้าง User สำหรับ Deployment
```bash
# สร้าง user ใหม่
sudo adduser deploy
sudo usermod -aG sudo deploy

# สร้าง SSH directory สำหรับ user ใหม่
sudo mkdir -p /home/deploy/.ssh
sudo cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

#### ติดตั้ง Docker
```bash
# ติดตั้ง Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# เพิ่ม user ใน docker group
sudo usermod -aG docker deploy

# ติดตั้ง Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### ติดตั้ง Node.js
```bash
# ใช้ NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# หรือใช้ NVM (แนะนำ)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### ติดตั้ง Nginx
```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# ตรวจสอบสถานะ
sudo systemctl status nginx
```

### 5.3 การตั้งค่า Firewall

#### UFW (Uncomplicated Firewall)
```bash
# เปิดใช้งาน UFW
sudo ufw enable

# อนุญาต SSH (port 22)
sudo ufw allow ssh

# อนุญาต HTTP (port 80)
sudo ufw allow 80

# อนุญาต HTTPS (port 443)
sudo ufw allow 443

# ดู rules ทั้งหมด
sudo ufw status verbose
```

### 5.4 การติดตั้ง SSL Certificate

#### ใช้ Certbot (Let's Encrypt)
```bash
# ติดตั้ง Certbot
sudo apt install certbot python3-certbot-nginx -y

# สร้าง certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# ตั้งค่า auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## 6. การใช้งาน Cloudflare

### 6.1 การตั้งค่าเบื้องต้น

#### เพิ่ม Domain ใน Cloudflare
```bash
# 1. เข้า Cloudflare Dashboard
# 2. กด "Add a Site"
# 3. ใส่ domain name
# 4. เลือก Plan (Free สำหรับเริ่มต้น)
# 5. Cloudflare จะ scan DNS records
# 6. เปลี่ยน Nameservers ที่ Domain Registrar
```

### 6.2 การตั้งค่า DNS Records

#### DNS Records Configuration
```bash
# A Records
Type: A
Name: @
Content: YOUR_DIGITAL_OCEAN_IP
TTL: Auto
Proxy Status: ✅ Proxied (Orange Cloud)

Type: A
Name: www
Content: YOUR_DIGITAL_OCEAN_IP
TTL: Auto
Proxy Status: ✅ Proxied (Orange Cloud)

# CNAME Records (ถ้ามี subdomain)
Type: CNAME
Name: api
Content: yourdomain.com
TTL: Auto
Proxy Status: ✅ Proxied
```

### 6.3 การตั้งค่า SSL/TLS

#### SSL/TLS Settings
```yaml
SSL/TLS Encryption Mode: Full (strict)
Always Use HTTPS: On
HTTP Strict Transport Security (HSTS): On
Minimum TLS Version: 1.2
Opportunistic Encryption: On
TLS 1.3: On
Automatic HTTPS Rewrites: On
```

### 6.4 การตั้งค่า Security

#### Security Settings
```yaml
Security Level: Medium
Bot Fight Mode: On
Challenge Passage: 30 minutes
Browser Integrity Check: On
Privacy Pass Support: On

# Rate Limiting (Business plan ขึ้นไป)
Zone Lockdown: Configure IP whitelist
WAF Custom Rules: Block malicious requests
```

### 6.5 Performance Optimization

#### Speed Settings
```yaml
Auto Minify:
  ☑️ JavaScript
  ☑️ CSS
  ☑️ HTML

Brotli: On
Early Hints: On (Enterprise plan)

# Caching
Browser Cache TTL: 1 month
Caching Level: Standard

# Page Rules (Pro plan ขึ้นไป)
Cache Everything: *.yourdomain.com/*
```

---

## 7. CI/CD Pipeline

### 7.1 GitHub Actions Configuration

#### Basic CI/CD Workflow
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: build/

  deploy:
    needs: [test, build]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Deploy to Digital Ocean
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.PRIVATE_KEY }}
          script: |
            cd /var/www/${{ github.event.repository.name }}
            git pull origin main
            docker-compose down
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

### 7.2 Environment Variables และ Secrets

#### GitHub Repository Secrets
```bash
# Settings > Secrets and variables > Actions

# Required Secrets:
HOST=your.server.ip
USERNAME=deploy
PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
JWT_SECRET=your-super-secret-key
API_KEY=your-api-key
```

### 7.3 Deployment Scripts

#### Deploy Script (deploy.sh)
```bash
#!/bin/bash

# deploy.sh
set -e

echo "🚀 Starting deployment..."

# Pull latest changes
git pull origin main

# Install/update dependencies
npm ci --only=production

# Build application
npm run build

# Restart services
docker-compose down
docker-compose up -d --build

# Health check
sleep 10
if curl -f http://localhost:3000/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed - health check failed"
    exit 1
fi

# Cleanup old images
docker system prune -f

echo "🎉 Deployment completed!"
```

---

## 8. Docker และ Container Management

### 8.1 Dockerfile Configuration

#### Production Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built application
COPY --from=build --chown=nextjs:nodejs /app/.next ./.next
COPY --from=build --chown=nextjs:nodejs /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=build --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
```

### 8.2 Docker Compose Configuration

#### Development Environment
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp_dev
    depends_on:
      - db
      - redis
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/dev.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

---

## 9. Multi-Project Production Architecture

### 9.1 โครงสร้าง Microservices Architecture

#### Project Structure Overview
```
production-system/
├── services/
│   ├── frontend-web/          # Next.js Web Application
│   ├── frontend-mobile/       # React Native Mobile App
│   ├── api-gateway/           # API Gateway (Express.js)
│   ├── auth-service/          # Authentication Service
│   ├── user-service/          # User Management Service
│   ├── product-service/       # Product Catalog Service
│   ├── order-service/         # Order Processing Service
│   ├── payment-service/       # Payment Processing Service
│   ├── notification-service/  # Email/SMS/Push Notifications
│   └── file-service/          # File Upload/Storage Service
├── shared/
│   ├── types/                 # Shared TypeScript types
│   ├── utils/                 # Common utilities
│   ├── configs/               # Shared configurations
│   └── schemas/               # Database schemas
├── infrastructure/
│   ├── docker/                # Docker configurations
│   ├── kubernetes/            # K8s manifests (optional)
│   ├── nginx/                 # Load balancer configs
│   ├── monitoring/            # Monitoring setup
│   └── scripts/               # Deployment scripts
├── docs/
│   ├── api/                   # API documentation
│   ├── architecture/          # System architecture docs
│   └── deployment/            # Deployment guides
└── docker-compose.prod.yml    # Production compose file
```

### 9.2 Individual Project Structure

#### Frontend Web Application
```
frontend-web/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   │   ├── api.ts             # API client
│   │   ├── auth.ts            # Authentication service
│   │   └── websocket.ts       # Real-time communication
│   ├── types/
│   └── utils/
├── public/
├── .env.example
├── .env.production
├── Dockerfile
├── nginx.conf
└── package.json
```

#### API Gateway Service
```
api-gateway/
├── src/
│   ├── routes/
│   │   ├── auth.ts            # Route to auth-service
│   │   ├── users.ts           # Route to user-service
│   │   ├── products.ts        # Route to product-service
│   │   └── orders.ts          # Route to order-service
│   ├── middleware/
│   │   ├── auth.ts            # JWT verification
│   │   ├── rateLimit.ts       # Rate limiting
│   │   ├── cors.ts            # CORS handling
│   │   └── logging.ts         # Request logging
│   ├── services/
│   │   ├── serviceRegistry.ts # Service discovery
│   │   └── loadBalancer.ts    # Load balancing
│   ├── utils/
│   └── config/
├── tests/
├── Dockerfile
└── package.json
```

#### Microservice Template (auth-service example)
```
auth-service/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── tokenController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── tokenService.ts
│   │   └── emailService.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── RefreshToken.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   └── health.ts
│   ├── middleware/
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   └── validator.ts
│   ├── config/
│   │   ├── database.ts
│   │   └── environment.ts
│   └── types/
├── tests/
├── migrations/
├── seeds/
├── Dockerfile
└── package.json
```

### 9.3 Inter-Service Communication

#### API Client Template
```typescript
// shared/utils/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string, serviceName: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Name': serviceName,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for authentication
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle token refresh
          return this.handleTokenRefresh(error);
        }
        return Promise.reject(error);
      }
    );
  }

  private getAuthToken(): string | null {
    return process.env.SERVICE_TOKEN || null;
  }

  private async handleTokenRefresh(error: any) {
    // Implement token refresh logic
    return Promise.reject(error);
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

// Service-specific clients
export const authServiceClient = new ApiClient(
  process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
  'api-gateway'
);

export const userServiceClient = new ApiClient(
  process.env.USER_SERVICE_URL || 'http://user-service:3002',
  'api-gateway'
);

export const productServiceClient = new ApiClient(
  process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003',
  'api-gateway'
);
```

#### Service Registry Pattern
```typescript
// shared/services/serviceRegistry.ts
interface ServiceConfig {
  name: string;
  url: string;
  healthEndpoint: string;
  version: string;
}

export class ServiceRegistry {
  private services: Map<string, ServiceConfig> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeServices();
    this.startHealthChecks();
  }

  private initializeServices() {
    const services: ServiceConfig[] = [
      {
        name: 'auth-service',
        url: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001',
        healthEndpoint: '/health',
        version: '1.0.0'
      },
      {
        name: 'user-service',
        url: process.env.USER_SERVICE_URL || 'http://user-service:3002',
        healthEndpoint: '/health',
        version: '1.0.0'
      },
      {
        name: 'product-service',
        url: process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003',
        healthEndpoint: '/health',
        version: '1.0.0'
      }
    ];

    services.forEach(service => {
      this.services.set(service.name, service);
    });
  }

  getService(name: string): ServiceConfig | undefined {
    return this.services.get(name);
  }

  getAllServices(): ServiceConfig[] {
    return Array.from(this.services.values());
  }

  private startHealthChecks() {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  private async performHealthChecks() {
    for (const [name, service] of this.services.entries()) {
      try {
        const response = await fetch(`${service.url}${service.healthEndpoint}`, {
          method: 'GET',
          timeout: 5000
        });

        if (!response.ok) {
          console.warn(`Service ${name} health check failed: ${response.status}`);
        }
      } catch (error) {
        console.error(`Service ${name} is unreachable:`, error);
      }
    }
  }
}
```

### 9.4 Production Docker Compose

#### Complete Multi-Service Configuration
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Frontend Services
  frontend-web:
    build:
      context: ./services/frontend-web
      target: production
    restart: unless-stopped
    environment:
      - NEXT_PUBLIC_API_URL=https://api.yourdomain.com
      - NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
    depends_on:
      - api-gateway
    networks:
      - frontend-network

  # API Gateway
  api-gateway:
    build: ./services/api-gateway
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - AUTH_SERVICE_URL=http://auth-service:3001
      - USER_SERVICE_URL=http://user-service:3002
      - PRODUCT_SERVICE_URL=http://product-service:3003
      - ORDER_SERVICE_URL=http://order-service:3004
      - PAYMENT_SERVICE_URL=http://payment-service:3005
      - NOTIFICATION_SERVICE_URL=http://notification-service:3006
      - FILE_SERVICE_URL=http://file-service:3007
      - REDIS_URL=redis://redis:6379
    depends_on:
      - auth-service
      - user-service
      - product-service
      - order-service
      - redis
    networks:
      - backend-network
      - frontend-network

  # Microservices
  auth-service:
    build: ./services/auth-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${AUTH_DB_URL}
      - JWT_SECRET=${JWT_SECRET}
      - REFRESH_TOKEN_SECRET=${REFRESH_TOKEN_SECRET}
      - EMAIL_SERVICE_URL=http://notification-service:3006
      - REDIS_URL=redis://redis:6379
    depends_on:
      - auth-db
      - redis
    networks:
      - backend-network

  user-service:
    build: ./services/user-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${USER_DB_URL}
      - AUTH_SERVICE_URL=http://auth-service:3001
      - FILE_SERVICE_URL=http://file-service:3007
    depends_on:
      - user-db
    networks:
      - backend-network

  product-service:
    build: ./services/product-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${PRODUCT_DB_URL}
      - FILE_SERVICE_URL=http://file-service:3007
      - ELASTICSEARCH_URL=http://elasticsearch:9200
    depends_on:
      - product-db
      - elasticsearch
    networks:
      - backend-network

  order-service:
    build: ./services/order-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${ORDER_DB_URL}
      - USER_SERVICE_URL=http://user-service:3002
      - PRODUCT_SERVICE_URL=http://product-service:3003
      - PAYMENT_SERVICE_URL=http://payment-service:3005
      - NOTIFICATION_SERVICE_URL=http://notification-service:3006
    depends_on:
      - order-db
    networks:
      - backend-network

  payment-service:
    build: ./services/payment-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${PAYMENT_DB_URL}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - OMISE_SECRET_KEY=${OMISE_SECRET_KEY}
      - NOTIFICATION_SERVICE_URL=http://notification-service:3006
    depends_on:
      - payment-db
    networks:
      - backend-network

  notification-service:
    build: ./services/notification-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${NOTIFICATION_DB_URL}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
      - SMS_API_KEY=${SMS_API_KEY}
      - PUSH_NOTIFICATION_KEY=${PUSH_NOTIFICATION_KEY}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - notification-db
      - redis
    networks:
      - backend-network

  file-service:
    build: ./services/file-service
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${FILE_DB_URL}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
      - AWS_REGION=${AWS_REGION}
    depends_on:
      - file-db
    volumes:
      - file-uploads:/app/uploads
    networks:
      - backend-network

  # Databases
  auth-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: ${AUTH_DB_USER}
      POSTGRES_PASSWORD: ${AUTH_DB_PASSWORD}
    volumes:
      - auth_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  user-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: user_db
      POSTGRES_USER: ${USER_DB_USER}
      POSTGRES_PASSWORD: ${USER_DB_PASSWORD}
    volumes:
      - user_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  product-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: product_db
      POSTGRES_USER: ${PRODUCT_DB_USER}
      POSTGRES_PASSWORD: ${PRODUCT_DB_PASSWORD}
    volumes:
      - product_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  order-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: order_db
      POSTGRES_USER: ${ORDER_DB_USER}
      POSTGRES_PASSWORD: ${ORDER_DB_PASSWORD}
    volumes:
      - order_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  payment-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: payment_db
      POSTGRES_USER: ${PAYMENT_DB_USER}
      POSTGRES_PASSWORD: ${PAYMENT_DB_PASSWORD}
    volumes:
      - payment_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  notification-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: notification_db
      POSTGRES_USER: ${NOTIFICATION_DB_USER}
      POSTGRES_PASSWORD: ${NOTIFICATION_DB_PASSWORD}
    volumes:
      - notification_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  file-db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: file_db
      POSTGRES_USER: ${FILE_DB_USER}
      POSTGRES_PASSWORD: ${FILE_DB_PASSWORD}
    volumes:
      - file_db_data:/var/lib/postgresql/data
    networks:
      - backend-network

  # Cache & Message Queue
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - backend-network

  # Search Engine
  elasticsearch:
    image: elasticsearch:8.8.0
    restart: unless-stopped
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    networks:
      - backend-network

  # Load Balancer
  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/prod.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
      - /var/log/nginx:/var/log/nginx
    depends_on:
      - api-gateway
      - frontend-web
    networks:
      - frontend-network

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports:
      - "9090:9090"
    volumes:
      - ./infrastructure/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - monitoring-network
      - backend-network

  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - monitoring-network

volumes:
  auth_db_data:
  user_db_data:
  product_db_data:
  order_db_data:
  payment_db_data:
  notification_db_data:
  file_db_data:
  redis_data:
  elasticsearch_data:
  file-uploads:
  prometheus_data:
  grafana_data:

networks:
  frontend-network:
    driver: bridge
  backend-network:
    driver: bridge
  monitoring-network:
    driver: bridge
```

### 9.5 Nginx Load Balancer Configuration

#### Production Nginx Configuration
```nginx
# infrastructure/nginx/prod.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/xml+rss application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

    # Upstream servers
    upstream api_backend {
        least_conn;
        server api-gateway:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    upstream web_backend {
        least_conn;
        server frontend-web:3000 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Main server block
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security Headers
        add_header X-Frame-Options DENY always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' wss: https:;" always;

        # Client max body size
        client_max_body_size 10M;

        # API Routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Authentication endpoints with stricter rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;

            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # WebSocket support
        location /api/ws {
            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static files with caching
        location /static/ {
            proxy_pass http://web_backend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Frontend application
        location / {
            proxy_pass http://web_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }

    # API subdomain
    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        # SSL Configuration (same as above)
        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_prefer_server_ciphers off;

        location / {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://api_backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 9.6 API Communication Examples

#### API Gateway Route Implementation
```typescript
// services/api-gateway/src/routes/users.ts
import express from 'express';
import { userServiceClient } from '../services/clients';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await userServiceClient.get(`/users/${userId}`);
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile',
  authenticateToken,
  validateRequest('updateProfile'),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;

      const updatedUser = await userServiceClient.put(`/users/${userId}`, updates);
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }
);

// Get user orders (calls order-service)
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderServiceClient.get(`/orders/user/${userId}`);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
```

#### Cross-Service Data Aggregation
```typescript
// services/api-gateway/src/services/aggregationService.ts
import { userServiceClient, orderServiceClient, productServiceClient } from './clients';

export class AggregationService {
  async getUserDashboard(userId: string) {
    try {
      // Parallel requests to multiple services
      const [user, orders, favoriteProducts] = await Promise.all([
        userServiceClient.get(`/users/${userId}`),
        orderServiceClient.get(`/orders/user/${userId}?limit=5`),
        productServiceClient.get(`/products/favorites/${userId}`)
      ]);

      // Aggregate and transform data
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        recentOrders: orders.map(order => ({
          id: order.id,
          status: order.status,
          total: order.total,
          createdAt: order.createdAt
        })),
        favoriteProducts: favoriteProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images[0]
        })),
        summary: {
          totalOrders: orders.length,
          totalSpent: orders.reduce((sum, order) => sum + order.total, 0)
        }
      };
    } catch (error) {
      throw new Error(`Failed to aggregate user dashboard: ${error.message}`);
    }
  }

  async getOrderDetails(orderId: string, userId: string) {
    try {
      // Get order details
      const order = await orderServiceClient.get(`/orders/${orderId}`);

      // Verify order belongs to user
      if (order.userId !== userId) {
        throw new Error('Unauthorized access to order');
      }

      // Get product details for each order item
      const productIds = order.items.map(item => item.productId);
      const products = await productServiceClient.post('/products/batch', { ids: productIds });

      // Merge order items with product details
      const enrichedItems = order.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: {
            name: product.name,
            image: product.images[0],
            description: product.description
          }
        };
      });

      return {
        ...order,
        items: enrichedItems
      };
    } catch (error) {
      throw new Error(`Failed to get order details: ${error.message}`);
    }
  }
}
```

### 9.7 Event-Driven Communication

#### Event Bus Implementation
```typescript
// shared/services/eventBus.ts
import Redis from 'ioredis';

export interface Event {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: Date;
}

export class EventBus {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers: Map<string, Array<(event: Event) => void>> = new Map();

  constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryStrategy: (times: number) => {
        return Math.min(times * 50, 2000);
      }
    };

    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);

    this.subscriber.on('message', this.handleMessage.bind(this));
  }

  async publish(event: Event): Promise<void> {
    await this.publisher.publish('events', JSON.stringify(event));
  }

  subscribe(eventType: string, handler: (event: Event) => void): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler);
    this.subscriber.subscribe('events');
  }

  private handleMessage(channel: string, message: string): void {
    const event: Event = JSON.parse(message);
    const handlers = this.handlers.get(event.type);

    if (handlers) {
      handlers.forEach(handler => handler(event));
    }
  }
}
```
