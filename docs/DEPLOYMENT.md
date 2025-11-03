# Deployment Guide

## Prerequisites

- Node.js 20+ (for frontend)
- Python 3.12 (for backend)
- PostgreSQL 14+ (for database)
- Docker and Docker Compose (optional, for containerized deployment)
- Domain name with SSL certificate

## Environment Variables

### Frontend

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=https://api.mia-commerce.com/api/v1
```

### Backend

Create a `.env` file in the `service-1` directory:

```env
PROJECT_NAME=MÍA E-Commerce API
API_V1_PREFIX=/api/v1

DATABASE_URL=postgresql+asyncpg://user:password@host:5432/mia_db

SECRET_KEY=your-secure-random-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

CORS_ORIGINS=["https://mia-commerce.com","https://www.mia-commerce.com"]

ENVIRONMENT=production
DEBUG=False

VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECRET_KEY=your_vnpay_secret_key
VNPAY_URL=https://www.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://mia-commerce.com/payment/callback
```

## Database Setup

### Using Docker Compose

```bash
docker-compose up -d postgres
```

### Manual PostgreSQL Setup

1. Create database:
```sql
CREATE DATABASE mia_db;
CREATE USER mia_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mia_db TO mia_user;
```

2. Run migrations (when Alembic is configured):
```bash
cd service-1
alembic upgrade head
```

## Frontend Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Configure environment variables in Vercel dashboard.

### Other Platforms

#### Netlify

```bash
cd frontend
npm run build
# Deploy .next folder to Netlify
```

#### AWS Amplify

1. Connect repository to AWS Amplify
2. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `.next`

#### Self-Hosted (Node.js)

```bash
cd frontend
npm ci
npm run build
npm start
```

## Backend Deployment

### Docker Deployment

1. Build image:
```bash
cd service-1
docker build -t mia-backend .
```

2. Run container:
```bash
docker run -d \
  --name mia-backend \
  -p 8000:8000 \
  --env-file .env \
  mia-backend
```

### Cloud Platform Options

#### Railway

1. Connect GitHub repository
2. Select `service-1` as root directory
3. Add environment variables
4. Railway automatically detects FastAPI and deploys

#### Heroku

1. Create `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

2. Deploy:
```bash
heroku create mia-backend
heroku config:set DATABASE_URL=...
git push heroku main
```

#### Google Cloud Run

1. Build container:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/mia-backend
```

2. Deploy:
```bash
gcloud run deploy mia-backend \
  --image gcr.io/PROJECT_ID/mia-backend \
  --platform managed \
  --region us-central1
```

#### AWS Elastic Beanstalk

1. Create `Procfile`:
```
web: uvicorn app.main:app --host 0.0.0.0 --port 8000
```

2. Deploy using EB CLI or console.

### Self-Hosted (Linux Server)

1. Setup systemd service (`/etc/systemd/system/mia-backend.service`):
```ini
[Unit]
Description=MÍA E-Commerce Backend
After=network.target

[Service]
Type=simple
User=mia
WorkingDirectory=/opt/mia-backend/service-1
Environment="PATH=/opt/mia-backend/venv/bin"
ExecStart=/opt/mia-backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

2. Enable and start:
```bash
sudo systemctl enable mia-backend
sudo systemctl start mia-backend
```

## Reverse Proxy (Nginx)

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name api.mia-commerce.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mia-commerce.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificate

Use Let's Encrypt with Certbot:

```bash
sudo certbot --nginx -d api.mia-commerce.com
```

## Monitoring

### Health Checks

- Frontend: `https://mia-commerce.com/health`
- Backend: `https://api.mia-commerce.com/health`

### Logging

- Frontend: Use Vercel Analytics or similar
- Backend: Configure logging in `app/main.py` or use services like Sentry

## Backup Strategy

1. Database backups (daily):
```bash
pg_dump -U mia_user mia_db > backup_$(date +%Y%m%d).sql
```

2. Store backups in cloud storage (AWS S3, Google Cloud Storage)

## Performance Optimization

### Frontend

- Enable Next.js Image Optimization
- Configure CDN (Cloudflare, AWS CloudFront)
- Enable caching headers

### Backend

- Use connection pooling for database
- Enable Redis caching (optional)
- Configure load balancing for multiple instances

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong SECRET_KEY
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure database backups
- [ ] Set up monitoring and alerts
- [ ] Review and update dependencies regularly

