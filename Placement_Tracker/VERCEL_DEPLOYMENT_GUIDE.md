# 🟢 Vercel Deployment - Complete Guide

**What:** Deploy your React frontend to Vercel  
**When:** After Oracle VM is created (at 5 PM)  
**Time:** 5 minutes

---

## 🎯 What We'll Do in Vercel (Simple 3-Step Process)

### Overview:
1. **Login to Vercel** (using CLI or website)
2. **Deploy frontend** (automatic build & upload)
3. **Add environment variable** (to connect to Oracle backend)

That's it! Vercel handles everything else automatically!

---

## 📋 Method 1: Vercel CLI (Recommended - Easier)

### Step 1: Login to Vercel

```powershell
# Open PowerShell
cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\placement-tracker-frontend"

# Login to Vercel
vercel login
```

**What happens:**
- Browser opens automatically
- Click "Continue with Email" or "Continue with GitHub"
- Confirm login
- Return to PowerShell

### Step 2: Deploy to Vercel

```powershell
# Deploy to production
vercel --prod
```

**You'll be asked:**

**Q: "Set up and deploy?"**  
A: Press `Y` (Yes)

**Q: "Which scope?"**  
A: Select your account (press Enter)

**Q: "Link to existing project?"**  
A: Press `N` (No - new project)

**Q: "What's your project's name?"**  
A: Type: `placement-tracker` (or any name) → Press Enter

**Q: "In which directory is your code located?"**  
A: Press Enter (current directory)

**Q: "Want to override settings?"**  
A: Press `N` (No)

**Vercel will now:**
- ✅ Upload your build files
- ✅ Deploy to CDN
- ✅ Give you a URL

**You'll see:**
```
✅ Production: https://placement-tracker-xyz123.vercel.app
```

**Copy this URL!** You'll need it!

### Step 3: Add Environment Variable

```powershell
# Set environment variable for backend API
vercel env add VITE_API_URL
```

**You'll be asked:**

**Q: "What's the value of VITE_API_URL?"**  
A: Type: `http://YOUR_ORACLE_IP:8080/api`  
   (Replace YOUR_ORACLE_IP with actual IP from Oracle)

**Q: "Add VITE_API_URL to which environment?"**  
A: Select **"Production"** (use arrow keys, press Enter)

**Q: "Add to other environments?"**  
A: Press `Y` and select **"Preview"** and **"Development"** too

### Step 4: Redeploy with Environment Variable

```powershell
# Redeploy to apply environment variable
vercel --prod
```

**Done!** Your frontend is now connected to Oracle backend!

---

## 📋 Method 2: Vercel Dashboard (Alternative)

If you prefer using the website:

### Step 1: Login to Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Login with your account
3. You'll see "Add New Project" button

### Step 2: Deploy via Dashboard

**Option A: Import from GitHub (if code is on GitHub)**
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Click "Deploy"

**Option B: Deploy via CLI (easier - use Method 1 above)**

### Step 3: Add Environment Variable in Dashboard

1. Go to your project in Vercel dashboard
2. Click **"Settings"** tab
3. Click **"Environment Variables"** (left sidebar)
4. Click **"Add New"**
5. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `http://YOUR_ORACLE_IP:8080/api`
   - **Environments:** Check all (Production, Preview, Development)
6. Click **"Save"**

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Confirm

---

## 🎯 What Happens Behind the Scenes in Vercel

### Automatic Processes:

1. **Upload:** Vercel uploads your `build/` folder
2. **CDN Distribution:** Spreads files across global CDN
3. **SSL Certificate:** Automatically adds HTTPS
4. **Build Optimization:** Minifies and optimizes assets
5. **Domain Assignment:** Gives you a `.vercel.app` domain
6. **Environment Variables:** Injects `VITE_API_URL` at build time

**You don't do any of this manually - it's automatic!** ✅

---

## 📊 What You'll Get from Vercel

### After Deployment:

**1. Production URL:**
```
https://placement-tracker-xyz123.vercel.app
```
- This is your live frontend URL
- Share with users
- Add to resume

**2. Preview URLs:** (for testing)
```
https://placement-tracker-git-main-username.vercel.app
```

**3. Deployment Dashboard:**
- Build logs
- Analytics
- Performance metrics
- Error tracking

**4. Automatic Features:**
- ✅ HTTPS (SSL) - Free
- ✅ Global CDN - Fast loading worldwide
- ✅ Auto-redeploy on git push (if using GitHub)
- ✅ Preview deployments
- ✅ Rollback capability

---

## 🔧 Environment Variable Explained

### Why We Need It:

Your frontend needs to know where the backend API is!

**Development (Local):**
```
VITE_API_URL=http://localhost:8080/api
```

**Production (Vercel):**
```
VITE_API_URL=http://YOUR_ORACLE_IP:8080/api
```

### How It Works:

In your `api.js` file:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"
```

- Vercel automatically replaces `import.meta.env.VITE_API_URL` with your Oracle IP
- All API calls go to: `http://YOUR_ORACLE_IP:8080/api/...`
- Frontend and backend are connected! ✅

---

## 🎯 Complete Vercel Workflow (At 5 PM)

### Timeline:

**After you create Oracle VM and share IP with me:**

```
Step 1: You tell me Oracle IP
        "My IP is: 158.123.45.67"
        
Step 2: I'll guide you through Vercel deployment
        
        Commands you'll run:
        cd placement-tracker-frontend
        vercel login
        vercel --prod
        vercel env add VITE_API_URL
        → Enter: http://158.123.45.67:8080/api
        vercel --prod
        
Step 3: Done! You get Vercel URL
        https://placement-tracker-xyz.vercel.app
        
Step 4: I'll update backend CORS with your Vercel URL
        
Step 5: Test everything - LIVE! 🎉
```

**Total time: 5 minutes**

---

## ✅ Vercel Account Settings (You Already Have)

### Current Status:
- [x] Account created
- [x] Email verified
- [x] Ready to deploy

### No Additional Setup Needed:
- ❌ No payment required (free tier is enough)
- ❌ No domain purchase needed (vercel.app domain is free)
- ❌ No SSL certificate setup (automatic)
- ❌ No server configuration (serverless)

**It's that simple!** Vercel does all the heavy lifting!

---

## 🔥 Vercel Free Tier Limits (More than Enough!)

| Feature | Free Tier | Your Usage | Status |
|---------|-----------|------------|--------|
| Deployments | Unlimited | ~1-2 | ✅ Plenty |
| Bandwidth | 100 GB/month | ~1-2 GB | ✅ Plenty |
| Build Time | 6000 minutes/month | ~1 min | ✅ Plenty |
| Serverless Functions | 100 GB-hours | Not using | ✅ N/A |
| Projects | Unlimited | 1 | ✅ Perfect |

**You're well within free limits!** No charges!

---

## 📝 Information You'll Need

### At Deployment Time:

1. **Oracle VM Public IP:** (you'll get this at 5 PM)
   ```
   Example: 158.123.45.67
   ```

2. **Environment Variable Format:**
   ```
   VITE_API_URL=http://158.123.45.67:8080/api
   ```
   (Replace with YOUR actual IP)

3. **Vercel URL:** (you'll get after deployment)
   ```
   Example: https://placement-tracker-abc123.vercel.app
   ```

---

## 🎯 Common Vercel Questions

### Q: Do I need to push code to GitHub first?
**A:** No! Vercel CLI uploads directly from your computer.

### Q: Can I use custom domain?
**A:** Yes, but not necessary. Free `.vercel.app` domain works great!

### Q: What if deployment fails?
**A:** Check build logs in terminal. Usually it's:
- Missing environment variable
- Wrong build directory
- I'll help you fix it!

### Q: Can I update the app later?
**A:** Yes! Just run `vercel --prod` again. New deployment!

### Q: Is HTTPS automatic?
**A:** Yes! All `.vercel.app` URLs have HTTPS (SSL) automatically.

### Q: How do I see logs?
**A:** Go to Vercel dashboard → Your project → Logs tab

---

## 🆘 Troubleshooting

### Problem: "vercel: command not found"
**Solution:**
```powershell
npm install -g vercel
```

### Problem: "Build failed"
**Solution:**
```powershell
# Make sure build folder exists
npm run build

# Then deploy
vercel --prod
```

### Problem: "API calls failing (404/CORS)"
**Solution:**
- Check `VITE_API_URL` is set correctly
- Verify Oracle VM backend is running
- I'll update backend CORS

### Problem: "Wrong environment variable"
**Solution:**
```powershell
# Remove wrong variable
vercel env rm VITE_API_URL

# Add correct one
vercel env add VITE_API_URL
```

---

## ✅ What You'll Have After Vercel Deployment

### Live URLs:
```
Frontend: https://placement-tracker-xyz.vercel.app
Backend:  http://YOUR_ORACLE_IP:8080/api
Database: MongoDB Atlas (cluster0.mongodb.net)
```

### Full Stack Connected:
```
User → Vercel Frontend → Oracle Backend → MongoDB Atlas
```

### Features Working:
- ✅ Student registration with OTP
- ✅ Login/Logout
- ✅ Add placement experiences
- ✅ Upload resumes
- ✅ View experiences by company/department
- ✅ Admin dashboard
- ✅ Mentor verification

---

## 🎯 Summary - What You'll Do in Vercel

**3 Simple Commands:**
```powershell
vercel login                    # Login to Vercel
vercel --prod                   # Deploy frontend
vercel env add VITE_API_URL     # Add backend URL
vercel --prod                   # Redeploy with variable
```

**Result:**
- ✅ Frontend live on Vercel
- ✅ Connected to Oracle backend
- ✅ Full application working
- ✅ HTTPS enabled
- ✅ Global CDN distribution

**Time: 5 minutes at 5 PM!**

---

## 📞 At 5 PM - I'll Guide You

**You share:** Oracle VM IP  
**I'll say:** "Run these commands..."  
**You run:** `vercel login` → `vercel --prod` → add env variable  
**Done!** Application live! 🚀

**Don't worry - it's super simple!** I'll be with you every step! 😊

---

**See you at 5 PM for deployment!** ⏰
