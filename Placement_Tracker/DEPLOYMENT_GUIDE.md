# 🚀 Placement Tracker - Complete Deployment Guide

## 📊 Architecture Overview

```
User Browser
   ↓
Vercel (React + Vite Frontend)
   ↓  REST API (HTTPS)
Oracle Cloud VM (Spring Boot Backend)
   ↓
MongoDB (Atlas OR On-VM)
```

---

## 🗂️ Deployment Order (FOLLOW THIS SEQUENCE)

### ✅ **Step 1: Setup MongoDB**

#### **Option A: MongoDB Atlas (Recommended for beginners)**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster (512MB)
3. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/placement_tracker_db
   ```

#### **Option B: MongoDB on Oracle VM (No size limit)**

```bash
# Install MongoDB on Oracle VM
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string (local)
mongodb://localhost:27017/placement_tracker_db
```

---

### ✅ **Step 2: Deploy Spring Boot to Oracle Cloud**

#### **2.1 Setup Oracle VM**

1. **Create Always-Free VM Instance**
   - Login to Oracle Cloud
   - Compute → Instances → Create Instance
   - Select: Ubuntu 22.04, Always Free tier
   - Save your private key (.pem file)

2. **Connect to VM**
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_PUBLIC_IP
   ```

#### **2.2 Install Java 21 on VM**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 21
sudo apt install -y openjdk-21-jdk

# Verify
java -version
```

#### **2.3 Open Port 8080**

**Oracle Console Method:**
1. VCN → Security Lists → Default Security List
2. Add Ingress Rule:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: TCP
   - Destination Port: 8080

**VM Firewall Method:**
```bash
sudo iptables -I INPUT 1 -p tcp --dport 8080 -j ACCEPT
sudo netfilter-persistent save
```

#### **2.4 Build & Upload Application**

**On Your Local Machine:**

```bash
# Navigate to backend directory
cd Placement_Tracker/Placement_Tracker

# Build JAR file
mvn clean package -DskipTests

# JAR file will be in: target/Placement_Tracker-0.0.1-SNAPSHOT.jar
```

**Upload to Oracle VM:**

```bash
# From your local machine
scp -i your-key.pem target/Placement_Tracker-0.0.1-SNAPSHOT.jar ubuntu@YOUR_PUBLIC_IP:~/
```

#### **2.5 Configure Production MongoDB**

**Create application-prod.properties on VM:**

```bash
# On Oracle VM
nano ~/application-prod.properties
```

**Add this content:**

```properties
# Production Configuration
spring.application.name=Placement_Tracker

# MongoDB Configuration (Update with your actual connection)
# For MongoDB Atlas:
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/placement_tracker_db

# For MongoDB on same VM:
# spring.data.mongodb.uri=mongodb://localhost:27017/placement_tracker_db

spring.data.mongodb.database=placement_tracker_db
spring.data.mongodb.auto-index-creation=true

# Server Configuration
server.port=8080

# Email Configuration (Update with your credentials)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# GCT Email Domain
app.gct.email.domain=gct.ac.in
app.admin.email=${ADMIN_EMAIL:admin@gct.ac.in}

# Base URL (Update with your actual domain or IP)
app.base.url=http://YOUR_PUBLIC_IP:8080

# File Upload Configuration
file.upload-dir=uploads
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# Swagger Configuration
springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

#### **2.6 Run Backend Application**

**Test Run (Temporary):**

```bash
java -jar Placement_Tracker-0.0.1-SNAPSHOT.jar --spring.config.location=application-prod.properties
```

**Test in Browser:**
```
http://YOUR_PUBLIC_IP:8080/swagger-ui.html
```

**Keep Running 24/7 (Production):**

```bash
# Create systemd service
sudo nano /etc/systemd/system/placement-tracker.service
```

**Service file content:**

```ini
[Unit]
Description=Placement Tracker Spring Boot Application
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/bin/java -jar /home/ubuntu/Placement_Tracker-0.0.1-SNAPSHOT.jar --spring.config.location=/home/ubuntu/application-prod.properties
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Start service:**

```bash
# Reload systemd
sudo systemctl daemon-reload

# Start service
sudo systemctl start placement-tracker

# Enable auto-start on boot
sudo systemctl enable placement-tracker

# Check status
sudo systemctl status placement-tracker

# View logs
sudo journalctl -u placement-tracker -f
```

---

### ✅ **Step 3: Deploy Frontend to Vercel**

#### **3.1 Prepare for Deployment**

**Update CORS in Backend:**

Before deploying, update `CorsConfig.java` with your Vercel URL:

```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://your-app-name.vercel.app",  // Update this
    "https://*.vercel.app"  // For preview deployments
));
```

Rebuild and redeploy backend after this change.

#### **3.2 Deploy to Vercel**

**Method 1: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd placement-tracker-frontend

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Project name: placement-tracker
# - Framework: Vite
# - Build Command: npm run build
# - Output Directory: build
```

**Method 2: GitHub Integration**

1. Push code to GitHub
2. Go to https://vercel.com
3. Import Repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `build`

#### **3.3 Configure Environment Variables in Vercel**

**Vercel Dashboard → Settings → Environment Variables:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `http://YOUR_ORACLE_PUBLIC_IP:8080/api` |

**Important:** Add this for Production, Preview, and Development environments.

After adding, **redeploy** the application.

---

## 🧪 Testing Full Flow

### **1. Test Backend API**

```bash
# Health check
curl http://YOUR_PUBLIC_IP:8080/v3/api-docs

# Get departments
curl http://YOUR_PUBLIC_IP:8080/api/departments
```

### **2. Test Frontend**

1. Open `https://your-app.vercel.app`
2. Check browser console (F12) for any CORS errors
3. Try browsing departments
4. Register as student
5. Add experience

### **3. Check CORS**

If you see CORS errors:
- Verify Vercel URL is in `CorsConfig.java`
- Rebuild and redeploy backend
- Clear browser cache

---

## 🔒 Optional: Add HTTPS to Backend (Recommended)

### **Using Let's Encrypt + Nginx**

```bash
# Install Nginx
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/placement-tracker
```

**Nginx config:**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/placement-tracker /etc/nginx/sites-enabled/

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Nginx will auto-configure HTTPS
```

**Update Vercel env variable:**
```
VITE_API_URL=https://your-domain.com/api
```

---

## 📝 Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **CORS Error** | Add Vercel URL to `CorsConfig.java` and rebuild |
| **API not reachable** | Check Oracle firewall rules for port 8080 |
| **MongoDB connection failed** | Verify connection string and whitelist IP in Atlas |
| **Backend crashes** | Check logs: `sudo journalctl -u placement-tracker -f` |
| **Build fails on Vercel** | Ensure all dependencies in `package.json` |
| **502 Bad Gateway** | Backend service not running, check systemd status |

---

## 🎯 Interview-Ready Explanation

> "I deployed my full-stack placement tracking system using a microservices architecture. The React frontend is hosted on Vercel for optimal CDN delivery and automatic CI/CD. The Spring Boot backend runs on an Oracle Cloud Always-Free VM, configured as a systemd service for 24/7 availability. I secured cross-origin communication using CORS policies and environment-based configuration. MongoDB is deployed on Atlas for cloud scalability. The entire stack communicates via RESTful APIs, with proper error handling and monitoring in place."

---

## 🔥 What's Next?

- [ ] Monitor application with logs
- [ ] Set up backup for MongoDB
- [ ] Add error tracking (Sentry)
- [ ] Implement rate limiting
- [ ] Add caching (Redis)
- [ ] Set up CI/CD pipeline

---

## 📞 Need Help?

**Check Logs:**

```bash
# Backend logs
sudo journalctl -u placement-tracker -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Restart Services:**

```bash
sudo systemctl restart placement-tracker
sudo systemctl restart nginx
```
