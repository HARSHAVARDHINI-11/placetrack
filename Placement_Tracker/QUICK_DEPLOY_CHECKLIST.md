# ⚡ Quick Deployment Checklist

## Before You Start

- [ ] Oracle Cloud account created
- [ ] Vercel account created
- [ ] MongoDB Atlas account created (or plan to install on VM)
- [ ] Have Oracle VM SSH key (.pem file)

---

## 📋 Deployment Steps

### **Phase 1: Backend Preparation (Local)**

- [ ] Build JAR file: `mvn clean package -DskipTests`
- [ ] JAR location: `target/Placement_Tracker-0.0.1-SNAPSHOT.jar`
- [ ] Note your Oracle VM Public IP: `________________`

### **Phase 2: Oracle VM Setup**

- [ ] Create VM instance (Ubuntu 22.04, Always Free)
- [ ] SSH to VM: `ssh -i your-key.pem ubuntu@PUBLIC_IP`
- [ ] Install Java 21: `sudo apt install openjdk-21-jdk`
- [ ] Open port 8080 in Oracle Console
- [ ] Run iptables: `sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT`

### **Phase 3: MongoDB Setup**

**Option A: MongoDB Atlas**
- [ ] Create cluster at mongodb.com/cloud/atlas
- [ ] Get connection string
- [ ] Whitelist Oracle VM IP
- [ ] Connection string: `mongodb+srv://...`

**Option B: Install on VM**
- [ ] Install MongoDB: `sudo apt install mongodb-org`
- [ ] Start service: `sudo systemctl start mongod`
- [ ] Connection: `mongodb://localhost:27017/placement_tracker_db`

### **Phase 4: Backend Deployment**

- [ ] Upload JAR to VM
- [ ] Create `application-prod.properties`
- [ ] Update MongoDB connection string
- [ ] Test run: `java -jar Placement_Tracker-0.0.1-SNAPSHOT.jar`
- [ ] Test API: `http://PUBLIC_IP:8080/swagger-ui.html`
- [ ] Create systemd service
- [ ] Start service: `sudo systemctl start placement-tracker`
- [ ] Enable auto-start: `sudo systemctl enable placement-tracker`

### **Phase 5: Update CORS**

- [ ] Update `CorsConfig.java` with Vercel URL
- [ ] Rebuild: `mvn clean package -DskipTests`
- [ ] Redeploy JAR to VM
- [ ] Restart service: `sudo systemctl restart placement-tracker`

### **Phase 6: Frontend Deployment**

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Navigate to frontend: `cd placement-tracker-frontend`
- [ ] Login: `vercel login`
- [ ] Deploy: `vercel`
- [ ] Note Vercel URL: `https://________________.vercel.app`

### **Phase 7: Environment Configuration**

- [ ] Go to Vercel Dashboard → Settings → Environment Variables
- [ ] Add: `VITE_API_URL` = `http://YOUR_PUBLIC_IP:8080/api`
- [ ] Apply to Production, Preview, Development
- [ ] Redeploy: `vercel --prod`

### **Phase 8: Final Testing**

- [ ] Open Vercel app URL
- [ ] Test departments page
- [ ] Register as student
- [ ] Add experience
- [ ] Check admin login
- [ ] Verify mentor registration flow

---

## ✅ Success Criteria

- [ ] Backend API accessible at `http://PUBLIC_IP:8080`
- [ ] Frontend loads at `https://your-app.vercel.app`
- [ ] No CORS errors in browser console
- [ ] Can browse departments
- [ ] Can register and login
- [ ] Can add experiences
- [ ] MongoDB shows data

---

## 🚨 If Something Goes Wrong

**Backend not accessible:**
```bash
# Check if running
sudo systemctl status placement-tracker

# View logs
sudo journalctl -u placement-tracker -f

# Check port
sudo netstat -tulpn | grep 8080
```

**CORS errors:**
1. Verify Vercel URL in `CorsConfig.java`
2. Rebuild backend
3. Restart service
4. Clear browser cache

**MongoDB connection failed:**
1. Check connection string in `application-prod.properties`
2. Verify IP whitelist in Atlas
3. Test: `mongosh "YOUR_CONNECTION_STRING"`

---

## 📊 URLs to Save

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | https://____________.vercel.app | Your Vercel URL |
| Backend API | http://____________:8080 | Oracle VM Public IP |
| Swagger Docs | http://____________:8080/swagger-ui.html | API Documentation |
| MongoDB | mongodb+srv://____________ | Connection String |

---

## 🎉 After Successful Deployment

1. **Update CORS** to remove `*` wildcards
2. **Add HTTPS** to backend (optional but recommended)
3. **Set up monitoring** (check logs weekly)
4. **Take backup** of MongoDB data
5. **Update Resume** with project URL
6. **Test thoroughly** before sharing

---

## 💡 Pro Tips

- Keep your SSH key safe
- Save all credentials securely
- Test locally before deploying
- Check logs regularly
- Monitor Oracle Free Tier limits
- Use environment variables for secrets
- Never commit `.env` files

---

**Deployment Time Estimate:** 1-2 hours for first time

Good luck! 🚀
