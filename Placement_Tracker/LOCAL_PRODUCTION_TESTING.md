# 🧪 Local Production Testing Guide

## ✅ Your Current Status:
- **Frontend:** Already deployed on Vercel ✅
  - URL: https://placement-tracker-frontend-mauve.vercel.app/
- **Backend:** Will test locally (port 8080)
- **Database:** MongoDB Atlas (cloud) ✅

## What This Does:
- Tests backend JAR (production build) locally on port 8080
- Uses MongoDB Atlas (cloud database)
- Two testing options:
  - **Option A:** Vercel frontend → Local backend (using ngrok/localtunnel)
  - **Option B:** Local frontend → Local backend (simpler, recommended first)

---

## Step 1: Update MongoDB Connection

1. Open Desktop → `mongodb_credentials.txt`
2. Copy your MongoDB password
3. Open: `application-local-prod.properties` (Notepad should be open)
4. Find line: `spring.data.mongodb.uri=mongodb+srv://...YOUR_PASSWORD...`
5. Replace `YOUR_PASSWORD` with your actual password
6. Save and close

---

## Step 2: Run Backend (Production Mode)

Open PowerShell and run:

```powershell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\Placement_Tracker"

# Create uploads folder
New-Item -ItemType Directory -Path "uploads" -Force

# Run JAR file with production config
java -jar target\Placement_Tracker-0.0.1-SNAPSHOT.jar --spring.config.location=application-local-prod.properties
```

**You should see:**
```
Started PlacementTrackerApplication in X.XXX seconds
```

**Backend will run on:** http://localhost:8080

---

## Step 3: Test Backend API

Open browser:
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Docs: http://localhost:8080/v3/api-docs
- Test endpoint: http://localhost:8080/api/departments

**All should load!** ✅

---

## Step 4: Test Backend Only (First!)

**Test backend is working before connecting frontend:**

Open browser and check:
- Swagger UI: http://localhost:8080/swagger-ui.html
- API Health: http://localhost:8080/api/departments
- Should see JSON response with empty array `[]` or departments

**If these work, backend is ready!** ✅

---

## Step 5A: Test with LOCAL Frontend (Recommended First)

### 5A.1: Update Frontend Config

```powershell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\placement-tracker-frontend"

# Open .env.local
notepad .env.local
```

**Make sure it says:**
```
VITE_API_URL=http://localhost:8080/api
```

Save and close.

### 5A.2: Serve Frontend (Production Build)

```powershell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\placement-tracker-frontend"

# Install serve tool (one-time only)
npm install -g serve

# Serve the production build
serve -s build -p 3000
```

**Frontend will run on:** http://localhost:3000

### 5A.3: Test Complete Application

1. **Open:** http://localhost:3000
2. **Test:**
## 📊 Architecture Options

### Option A: Local Testing
```
Browser (localhost:3000)
   ↓ API calls
Local Frontend Build
   ↓ API calls
Backend JAR (localhost:8080)
   ↓ Database queries
MongoDB Atlas (Cloud)
```

### Option B: Vercel + Local Backend
```
Browser
   ↓
Vercel Frontend (https://placement-tracker-frontend-mauve.vercel.app)
   ↓ API calls
ngrok Tunnel (https://abc123.ngrok.io)
   ↓ forwards tohttps://ngrok.com/download
- Sign up (free)
- Download Windows version
- Extract to Desktop

### 5B.2: Expose Local Backend

```powershell
# Navigate to ngrok folder
cd "C:\Users\harsh\Desktop\ngrok"

# Start tunnel on port 8080
.\ngrok http 8080
```

**You'll get a public URL like:**
```
Forwarding: https://abc123.ngrok.io → http://localhost:8080
```

**Copy this URL!** Example: `https://abc123.ngrok.io`

### 5B.3: Update CORS in Backend

**Stop backend (Ctrl+C) and update:**

```powershell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\Placement_Tracker"
notepad src\main\java\com\quizapplication\placement_tracker\config\CorsConfig.java
```

**Add ngrok URL to allowed origins:**

Find this line:
```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
```

Add your ngrok URL:
```java
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3000",
    "https://placement-tracker-frontend-mauve.vercel.app",
    "https://abc123.ngrok.io"  // Add this line with YOUR ngrok URL
));
```

**Save and rebuild:**
```powershell
mvn clean package -DskipTests
```

### 5B.4: Update Vercel Environment Variable

**Option 1: Via Vercel Dashboard**
1. Go to: https://vercel.com/harshavardhini-ns-projects/placement-tracker-frontend/settings/environment-variables
2. Find `VITE_API_URL`
3. Update value to: `https://abc123.ngrok.io/api` (YOUR ngrok URL)
4. Redeploy: Go to Deployments → Click "..." → Redeploy

**Option 2: Via CLI**
```powershell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\placement-tracker-frontend"
vercel env rm VITE_API_URL production
vercel env add VITE_API_URL production
# Enter: https://abc123.ngrok.io/api
vercel --prod
```

### 5B.5: Test Vercel Frontend

1. Open: https://placement-tracker-frontend-mauve.vercel.app/
2. Check browser console (F12)
3. Should see API calls going to your ngrok URL
4. Test registration, login, etc.

**⚠️ Note:** ngrok free tier URL changes every restart!

---

## Step 6: Choose Your Testing Path

### Path A: Local Frontend + Local Backend (Simple)
✅ Use Step 5A  
✅ Fast testing  
✅ No additional tools needed  
✅ Recommended for development testing

### Path B: Vercel Frontend + Local Backend (Advanced)
✅ Use Step 5B  
✅ Tests real production frontend  
✅ Requires ngrok  
✅ Good for final pre-deployment testing

1. **Open:** http://localhost:3000
2. **Test:**
   - Browse departments ✅
   - Register new student ✅
   - Check OTP email ✅
   - Login ✅
   - Add placement experience ✅
   - Upload resume ✅

**Everything should work exactly like production!** 🎉

---

## 📊 Architecture (Local Production Testing)

```
Browser (localhost:3000)
   ↓ API calls
Backend JAR (localhost:8080)
   ↓ Database queries
MongoDB Atlas (Cloud)
```

---

## 🛑 To Stop Testing:

**Stop Backend:**
- In PowerShell running JAR: Press `Ctrl+C`

**Stop Frontend:**
- In PowerShell running serve: Press `Ctrl+C`

---

## ✅ What You're Testing:

✅ Production JAR (not dev mode `mvn spring-boot:run`)  
✅ Production frontend build (not dev mode `npm start`)  
✅ Real MongoDB Atlas database  
✅ Real email sending  
✅ Exact same as cloud deployment

---

## 🎯 After Local Testing Success:

1. **Backend works?** → Deploy JAR to AWS/Railway/Oracle
2. **Frontend works?** → Already on Vercel ✅
3. **Just update Vercel** env variable to cloud backend URL
4. **Done!** Full production deployment! 🚀

---

## 🆘 Troubleshooting:

**Backend won't start:**
- Check MongoDB password in `application-local-prod.properties`
- Make sure port 8080 is free
- Check Java version: `java -version` (should be 21)

**Frontend can't connect:**
- Check `.env.local` has `VITE_API_URL=http://localhost:8080/api`
- Make sure backend is running first
- Check browser console for errors

**Database errors:**
- Verify MongoDB Atlas connection string
- Check network access allows 0.0.0.0/0
- Confirm database user exists

---

## 💡 Pro Tip:

Keep backend and frontend running in **separate PowerShell windows** so you can see logs from both!

**Window 1:** Backend JAR  
**Window 2:** Frontend serve

---

**Ready to test locally?** Follow the steps above! 🧪
