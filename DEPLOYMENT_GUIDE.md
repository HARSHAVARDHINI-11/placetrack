# 🚀 Free Deployment Guide for GCT PlaceTrack

Complete guide to deploy your Placement Tracker application for **FREE** using modern cloud platforms.

---

## 📋 Overview

Your application has 3 components:
1. **Backend** (Spring Boot + Java) - Port 8080
2. **Frontend** (React + Vite) - Port 3000
3. **Database** (MongoDB) - Port 27017

---

## 🗄️ Step 1: Deploy MongoDB Database

### Option: MongoDB Atlas (Recommended - Free Forever)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up with Google/GitHub or email

2. **Create Free Cluster**
   - Choose **M0 Sandbox** (Free Forever)
   - Select region closest to you (e.g., AWS Mumbai/Singapore)
   - Cluster name: `placetrack-cluster`

3. **Setup Database Access**
   - Go to **Database Access** → Add New User
   - Username: `placetrack_user`
   - Password: Generate secure password (save it!)
   - Database User Privileges: Read and write to any database

4. **Setup Network Access**
   - Go to **Network Access** → Add IP Address
   - Click **Allow Access from Anywhere** (0.0.0.0/0)
   - Or add specific IPs for better security

5. **Get Connection String**
   - Go to **Database** → Click **Connect**
   - Choose **Connect your application**
   - Copy connection string:
   ```
   mongodb+srv://placetrack_user:<password>@placetrack-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Add database name: `placement_tracker`
   ```
   mongodb+srv://placetrack_user:yourpassword@placetrack-cluster.xxxxx.mongodb.net/placement_tracker?retryWrites=true&w=majority
   ```

6. **Save for Later**
   - Keep this connection string - you'll need it for backend deployment

---

## 🔧 Step 2: Deploy Backend (Spring Boot)

### Option A: Render.com (Recommended - Free)

**Free Tier:**
- 750 hours/month free
- Auto-sleep after 15 mins of inactivity
- Wakes up automatically on request

**Steps:**

1. **Prepare Backend**
   - Update `application.properties`:
   ```properties
   # Use environment variable for MongoDB
   spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/placement_tracker}
   
   # Server port (Render assigns this)
   server.port=${PORT:8080}
   
   # Email settings (use environment variables)
   spring.mail.host=${SMTP_HOST:smtp.gmail.com}
   spring.mail.port=${SMTP_PORT:587}
   spring.mail.username=${EMAIL_USERNAME}
   spring.mail.password=${EMAIL_PASSWORD}
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   ```

2. **Create `render.yaml` in project root**
   ```yaml
   services:
     - type: web
       name: placetrack-backend
       env: java
       buildCommand: ./mvnw clean package -DskipTests
       startCommand: java -jar target/Placement_Tracker-0.0.1-SNAPSHOT.jar
       envVars:
         - key: MONGODB_URI
           sync: false
         - key: EMAIL_USERNAME
           sync: false
         - key: EMAIL_PASSWORD
           sync: false
         - key: SMTP_HOST
           value: smtp.gmail.com
         - key: SMTP_PORT
           value: 587
   ```

3. **Push to GitHub**
   ```bash
   cd Placement_Tracker
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

4. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click **New +** → **Web Service**
   - Connect your GitHub repository
   - Select `placetrack` repository
   - Configure:
     - **Name**: `placetrack-backend`
     - **Region**: Singapore (or closest)
     - **Branch**: `main`
     - **Root Directory**: `Placement_Tracker`
     - **Build Command**: `./mvnw clean package -DskipTests`
     - **Start Command**: `java -jar target/Placement_Tracker-0.0.1-SNAPSHOT.jar`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `EMAIL_USERNAME`: Your Gmail
     - `EMAIL_PASSWORD`: Your Gmail App Password
   - Click **Create Web Service**

5. **Note Backend URL**
   - After deployment: `https://placetrack-backend.onrender.com`
   - Save this URL for frontend configuration

### Option B: Railway.app (Alternative - Free Trial)

1. Go to [Railway.app](https://railway.app/)
2. Sign in with GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Select your repository
5. Add environment variables (same as above)
6. Railway will auto-detect Spring Boot and deploy

### Option C: Fly.io (Alternative)

1. Install Fly CLI: [https://fly.io/docs/hands-on/install-flyctl/](https://fly.io/docs/hands-on/install-flyctl/)
2. Run `fly launch` in backend directory
3. Follow prompts to deploy

---

## 🎨 Step 3: Deploy Frontend (React)

### Option A: Vercel (Recommended - Best for React)

**Free Tier:**
- Unlimited deployments
- Auto SSL
- Global CDN
- Instant rollback

**Steps:**

1. **Update API Configuration**
   
   Create `.env.production` in frontend folder:
   ```env
   VITE_API_URL=https://placetrack-backend.onrender.com
   ```

2. **Update `src/services/api.js`**
   ```javascript
   import axios from "axios";
   
   const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
   
   const api = axios.create({
     baseURL: API_BASE_URL,
     headers: {
       "Content-Type": "application/json",
     },
   });
   
   // Rest of your API code...
   ```

3. **Create `vercel.json` in frontend root**
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

4. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com/)
   - Sign in with GitHub
   - Click **Add New** → **Project**
   - Import your `placetrack` repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `placement-tracker-frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: `https://placetrack-backend.onrender.com`
   - Click **Deploy**

5. **Get Frontend URL**
   - After deployment: `https://placetrack.vercel.app`

### Option B: Netlify (Alternative)

1. Go to [Netlify](https://www.netlify.com/)
2. Sign in with GitHub
3. Click **Add new site** → **Import from Git**
4. Select repository → `placement-tracker-frontend`
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Add `VITE_API_URL`
6. Deploy

### Option C: GitHub Pages (Free but Limited)

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   {
     "homepage": "https://HARSHAVARDHINI-11.github.io/placetrack",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

---

## ⚙️ Step 4: Configure CORS (Backend)

Update `SecurityConfig.java` or create CORS configuration:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins(
                        "https://placetrack.vercel.app",
                        "http://localhost:3000"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

---

## 📧 Step 5: Setup Email Service (Gmail)

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification

2. **Create App Password**
   - Google Account → Security
   - 2-Step Verification → App passwords
   - Select app: Mail
   - Select device: Other (Custom name) → "PlaceTrack"
   - Copy generated 16-character password

3. **Add to Environment Variables**
   - In Render/Railway dashboard
   - `EMAIL_USERNAME`: your-email@gmail.com
   - `EMAIL_PASSWORD`: 16-character app password

---

## 🔍 Step 6: Testing Deployment

1. **Test Backend**
   ```bash
   curl https://placetrack-backend.onrender.com/actuator/health
   ```

2. **Test Frontend**
   - Visit `https://placetrack.vercel.app`
   - Try register/login flow
   - Check browser console for errors

3. **Check Database**
   - MongoDB Atlas → Collections
   - Verify data is being stored

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **MongoDB Atlas** | M0 Sandbox | 512 MB storage, Shared CPU |
| **Render.com** | Free tier | 750 hrs/month, Auto-sleep after 15 min |
| **Vercel** | Hobby plan | 100 GB bandwidth, Unlimited deploys |
| **Total Cost** | **$0/month** | Perfect for portfolio/learning |

---

## 🎯 Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string saved
- [ ] Backend `application.properties` updated with env variables
- [ ] Backend deployed to Render.com
- [ ] Backend URL noted
- [ ] Frontend `.env.production` created
- [ ] Frontend `api.js` updated
- [ ] Frontend deployed to Vercel
- [ ] CORS configured in backend
- [ ] Gmail app password created
- [ ] All environment variables set
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test mentor approval flow
- [ ] Test experience posting

---

## 🚨 Common Issues & Solutions

### Backend won't start on Render
- **Issue**: Build fails
- **Solution**: Check Java version in `pom.xml` matches Render's Java version
- Add to `render.yaml`:
  ```yaml
  env: java
  buildCommand: ./mvnw clean package -DskipTests
  ```

### Frontend can't connect to backend
- **Issue**: CORS error
- **Solution**: Add frontend URL to CORS allowed origins in backend

### MongoDB connection fails
- **Issue**: Authentication error
- **Solution**: 
  - Check password has no special characters causing issues
  - Encode password in connection string
  - Verify IP whitelist includes 0.0.0.0/0

### Render backend sleeps after 15 minutes
- **Issue**: First request takes 30-60 seconds
- **Solution**: 
  - Expected behavior on free tier
  - Consider paid tier ($7/month) for always-on
  - Or use Railway/Fly.io alternatives

### Email notifications not working
- **Issue**: Gmail blocks login
- **Solution**: Use App Password, not regular password

---

## 🔄 CI/CD - Automatic Deployment

Both Vercel and Render support automatic deployment:

1. **Push to GitHub main branch**
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```

2. **Auto-deploy triggers**
   - Vercel: Deploys frontend automatically
   - Render: Deploys backend automatically

3. **Monitor deployments**
   - Check deployment logs in respective dashboards

---

## 📊 Monitoring & Analytics

### Free Monitoring Tools

1. **UptimeRobot** (Free)
   - Monitor backend uptime
   - Get alerts when backend goes down
   - Wake up sleeping Render service

2. **Google Analytics** (Free)
   - Track frontend user behavior
   - Add to `index.html`

3. **Sentry** (Free tier)
   - Error tracking
   - Performance monitoring

---

## 🎓 Alternative Free Options

### Backend Alternatives:
1. **Heroku** - $5/month (was free)
2. **AWS EC2 Free Tier** - 12 months free
3. **Google Cloud Run** - Free tier available
4. **Azure App Service** - Free tier available

### Frontend Alternatives:
1. **Cloudflare Pages** - Unlimited free
2. **Firebase Hosting** - Free tier generous
3. **Surge.sh** - Free for unlimited sites

### Database Alternatives:
1. **ElephantSQL** - Free PostgreSQL (if you switch DB)
2. **Supabase** - Free PostgreSQL + Auth
3. **PlanetScale** - Free MySQL

---

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Use environment variables for all secrets
3. **CORS**: Only allow specific origins in production
4. **HTTPS**: Both Vercel and Render provide free SSL
5. **Rate Limiting**: Add rate limiting to prevent abuse

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- **Spring Boot Deployment**: https://spring.io/guides/gs/spring-boot-docker/

---

## 🎉 Congratulations!

Your application is now live and accessible worldwide! Share your URLs:

- **Frontend**: `https://placetrack.vercel.app`
- **Backend API**: `https://placetrack-backend.onrender.com`

Add these to your resume, LinkedIn, and GitHub README! 🚀

---

**Need Help?** Check deployment logs:
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Logs
- MongoDB Atlas: Dashboard → Metrics
