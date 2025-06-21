# YCEmpire Deployment Guide

This guide will help you deploy the YCEmpire applications as separate subdomains.

## Architecture

The YCEmpire platform consists of 5 independent applications:

- **Main App** (ycempire.com) - Port 3000
- **Admin App** (admin.ycempire.com) - Port 3001
- **Bookings App** (bookings.ycempire.com) - Port 3002
- **Rentals App** (rentals.ycempire.com) - Port 3003
- **Links App** (links.ycempire.com) - Port 3004

## Prerequisites

1. **Docker** (version 20.10 or higher)
2. **Docker Compose** (version 2.0 or higher)
3. **Domain and DNS Configuration**

## DNS Configuration

Before deployment, configure your DNS records to point to your server:

```
A Record: ycempire.com → [YOUR_SERVER_IP]
A Record: admin.ycempire.com → [YOUR_SERVER_IP]
A Record: bookings.ycempire.com → [YOUR_SERVER_IP]
A Record: rentals.ycempire.com → [YOUR_SERVER_IP]
A Record: links.ycempire.com → [YOUR_SERVER_IP]
```

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

### Option 2: Manual Deployment

```bash
# Build and start all services
docker-compose up -d --build

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

## Individual App Development

Each app can be developed independently:

```bash
# Admin App
cd apps/admin
npm install
npm run dev

# Bookings App
cd apps/bookings
npm install
npm run dev

# Rentals App
cd apps/rentals
npm install
npm run dev

# Links App
cd apps/links
npm install
npm run dev

# Main App
cd apps/main
npm install
npm run dev
```

## Building Individual Apps

```bash
# Build admin app
cd apps/admin
npm run build

# Build bookings app
cd apps/bookings
npm run build

# Build rentals app
cd apps/rentals
npm run build

# Build links app
cd apps/links
npm run build

# Build main app
cd apps/main
npm run build
```

## SSL/HTTPS Configuration

To enable HTTPS, follow these steps:

1. **Obtain SSL Certificates** (Let's Encrypt recommended)
2. **Create SSL directory:**
   ```bash
   mkdir ssl
   ```

3. **Place your certificates:**
   ```
   ssl/
   ├── ycempire.com.crt
   ├── ycempire.com.key
   ├── admin.ycempire.com.crt
   ├── admin.ycempire.com.key
   └── ...
   ```

4. **Uncomment HTTPS configuration in nginx.conf**
5. **Restart services:**
   ```bash
   docker-compose restart nginx
   ```

## Docker Commands

### Useful Commands

```bash
# View all running containers
docker-compose ps

# View logs for specific service
docker-compose logs -f admin-app
docker-compose logs -f bookings-app
docker-compose logs -f rentals-app
docker-compose logs -f links-app
docker-compose logs -f main-app

# Restart specific service
docker-compose restart admin-app

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose build admin-app

# Update and restart specific service
docker-compose up -d --build admin-app
```

### Container Management

```bash
# Access container shell
docker-compose exec admin-app sh
docker-compose exec bookings-app sh

# Copy files from/to container
docker cp admin-app:/app/dist ./backup-admin
docker cp ./new-file admin-app:/app/src/
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3001
   
   # Kill the process
   kill -9 [PID]
   ```

2. **Build Failures**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

3. **Nginx Configuration Issues**
   ```bash
   # Test nginx configuration
   docker-compose exec nginx nginx -t
   
   # Reload nginx
   docker-compose exec nginx nginx -s reload
   ```

### Log Analysis

```bash
# View all logs
docker-compose logs

# View logs with timestamps
docker-compose logs -t

# View logs for last 100 lines
docker-compose logs --tail=100

# Follow logs in real-time
docker-compose logs -f
```

## Monitoring

### Health Checks

Each app includes health check endpoints:

- Main App: `http://ycempire.com/health`
- Admin App: `http://admin.ycempire.com/health`
- Bookings App: `http://bookings.ycempire.com/health`
- Rentals App: `http://rentals.ycempire.com/health`
- Links App: `http://links.ycempire.com/health`

### Resource Monitoring

```bash
# View resource usage
docker stats

# View disk usage
docker system df
```

## Updates and Maintenance

### Updating Applications

1. **Pull latest code**
   ```bash
   git pull origin main
   ```

2. **Rebuild and restart**
   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

### Backup Strategy

```bash
# Backup application data
docker-compose exec admin-app tar -czf /tmp/admin-backup.tar.gz /app/dist
docker cp admin-app:/tmp/admin-backup.tar.gz ./backups/

# Backup database (if applicable)
docker-compose exec database pg_dump -U username database_name > backup.sql
```

## Environment Variables

Each app can be configured with environment variables:

```bash
# Example environment configuration
NODE_ENV=production
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## Support

For deployment issues:

1. Check the logs: `docker-compose logs -f`
2. Verify DNS configuration
3. Ensure all ports are available
4. Check firewall settings

## Production Checklist

- [ ] DNS records configured
- [ ] SSL certificates installed
- [ ] Environment variables set
- [ ] Database configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
- [ ] Security measures in place
- [ ] Performance optimization applied 