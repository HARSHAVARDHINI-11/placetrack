# ☁️ Oracle Cloud VM Setup - Interactive Checklist

**Goal:** Get your backend running on Oracle Cloud Always-Free VM

**Time Estimate:** 15-20 minutes

---

## 📋 Pre-Setup

- [ ] **Have Oracle Cloud account ready**
  - Go to: https://www.oracle.com/cloud/free/
  - Sign up if needed (requires credit card for verification, but won't charge)
  - Login to console: https://cloud.oracle.com/

- [ ] **Files you'll need:**
  - ✅ Backend JAR: `Placement_Tracker\Placement_Tracker\target\Placement_Tracker-0.0.1-SNAPSHOT.jar`
  - 📝 This checklist
  - 🔑 SSH key (will download from Oracle)

---

## 🖥️ Step 1: Create VM Instance (5 min)

- [ ] Login to Oracle Cloud Console
- [ ] Click **"Create a VM Instance"** (or Compute → Instances → Create Instance)
- [ ] **Instance Name:** `placement-tracker-vm` (or any name)
- [ ] **Image and Shape:**
  - Image: **Ubuntu 22.04** (Canonical-Ubuntu-22.04)
  - Shape: **VM.Standard.E2.1.Micro** (Always Free tier - 1GB RAM)
  - Click "Change Shape" if needed → AMD → VM.Standard.E2.1.Micro
- [ ] **Networking:**
  - Leave default VCN (Virtual Cloud Network)
  - **Assign public IPv4 address:** ✅ CHECKED (IMPORTANT!)
- [ ] **SSH Keys:**
  - Select **"Generate SSH key pair"**
  - Click **"Save Private Key"** - save as `placement-tracker-key.pem`
  - Save to a safe location (you'll need this to connect!)
- [ ] Click **"Create"** button
- [ ] Wait 1-2 minutes for provisioning (status will change to "Running")
- [ ] **Copy the Public IP Address** - write it down: `___.___.___.___`

---

## 🔓 Step 2: Open Port 8080 in Oracle Firewall (3 min)

- [ ] In the VM details page, find **"Virtual Cloud Network"** link (under Primary VNIC)
- [ ] Click on the VCN name (e.g., `vcn-20260117-1330`)
- [ ] Click **"Security Lists"** on left sidebar
- [ ] Click **"Default Security List for ..."**
- [ ] Click **"Add Ingress Rules"** button
- [ ] Fill in:
  - **Source CIDR:** `0.0.0.0/0`
  - **IP Protocol:** TCP
  - **Destination Port Range:** `8080`
  - **Description:** `Spring Boot API`
- [ ] Click **"Add Ingress Rules"**
- [ ] ✅ Port 8080 is now open!

---

## 🔌 Step 3: Connect to VM (2 min)

### Windows (PowerShell):

- [ ] Open PowerShell
- [ ] Navigate to where you saved the key:
  ```powershell
  cd "C:\path\to\your\key"
  ```
- [ ] Connect with SSH:
  ```powershell
  ssh -i placement-tracker-key.pem ubuntu@YOUR_PUBLIC_IP
  ```
  - Replace `YOUR_PUBLIC_IP` with the IP you copied earlier
- [ ] If asked "Are you sure you want to continue?", type `yes` and press Enter
- [ ] ✅ You're now connected to Oracle VM! (You'll see `ubuntu@placement-tracker-vm:~$`)

**Troubleshooting:**
- If you get "permissions error" on Windows, try:
  ```powershell
  icacls placement-tracker-key.pem /inheritance:r /grant:r "%USERNAME%:R"
  ```

---

## ☕ Step 4: Install Java 21 (3 min)

**Run these commands on the VM:**

- [ ] Update system:
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
  (This takes 1-2 minutes, press Y if asked)

- [ ] Install Java 21:
  ```bash
  sudo apt install -y openjdk-21-jdk
  ```

- [ ] Verify installation:
  ```bash
  java -version
  ```
  - ✅ Should show: `openjdk version "21.0.x"`

---

## 🗄️ Step 5: Setup MongoDB (Choose ONE option)

### Option A: MongoDB Atlas (Easier - Recommended)

- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Sign up / Login
- [ ] Create new cluster:
  - Click "Build a Database"
  - Select **"M0 Free"** tier
  - Choose region closest to your Oracle VM
  - Cluster name: `placement-tracker`
- [ ] Create Database User:
  - Username: `admin` (or your choice)
  - Password: (generate strong password - SAVE IT!)
- [ ] Network Access:
  - Click "Add IP Address"
  - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
  - (Or add your Oracle VM public IP specifically)
- [ ] Get Connection String:
  - Click "Connect" → "Connect your application"
  - Copy the connection string:
    ```
    mongodb+srv://admin:<password>@cluster.mongodb.net/placement_tracker_db
    ```
  - Replace `<password>` with your actual password
  - **Save this connection string!** You'll need it in Step 6

### Option B: MongoDB on Same VM (Advanced)

- [ ] Install MongoDB:
  ```bash
  wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
  sudo apt update
  sudo apt install -y mongodb-org
  ```

- [ ] Start MongoDB:
  ```bash
  sudo systemctl start mongod
  sudo systemctl enable mongod
  ```

- [ ] Verify:
  ```bash
  sudo systemctl status mongod
  ```
  - ✅ Should show "active (running)"

- [ ] Connection string to use: `mongodb://localhost:27017/placement_tracker_db`

---

## 📤 Step 6: Upload JAR File (2 min)

**On your local Windows machine (NEW PowerShell window):**

- [ ] Navigate to project directory:
  ```powershell
  cd "C:\Users\harsh\OneDrive\Desktop\place_Harsha\Placement_Tracker\Placement_Tracker"
  ```

- [ ] Upload JAR to Oracle VM:
  ```powershell
  scp -i "C:\path\to\placement-tracker-key.pem" target\Placement_Tracker-0.0.1-SNAPSHOT.jar ubuntu@YOUR_PUBLIC_IP:~/
  ```
  - Replace path to your key file
  - Replace `YOUR_PUBLIC_IP`
  - Takes 20-30 seconds to upload

- [ ] Verify upload succeeded (back in VM SSH session):
  ```bash
  ls -lh ~/Placement_Tracker-0.0.1-SNAPSHOT.jar
  ```
  - ✅ Should show file size ~60-80MB

---

## ⚙️ Step 7: Configure Production Properties (3 min)

**On the Oracle VM:**

- [ ] Create production config file:
  ```bash
  nano ~/application-prod.properties
  ```

- [ ] Copy and paste this content (press right-click to paste in PuTTY/PowerShell):

```properties
spring.application.name=Placement_Tracker

# MongoDB - UPDATE THIS LINE with your connection string!
spring.data.mongodb.uri=YOUR_MONGODB_CONNECTION_STRING_HERE
spring.data.mongodb.database=placement_tracker_db
spring.data.mongodb.auto-index-creation=true

server.port=8080

# Email - UPDATE with your Gmail credentials
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-specific-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

app.gct.email.domain=gct.ac.in
app.admin.email=admin@gct.ac.in

# Base URL - UPDATE with your Oracle VM public IP
app.base.url=http://YOUR_PUBLIC_IP:8080

file.upload-dir=uploads
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

springdoc.api-docs.path=/v3/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

- [ ] **EDIT these lines:**
  - `spring.data.mongodb.uri=` → Your MongoDB connection string
  - `spring.mail.username=` → Your Gmail
  - `spring.mail.password=` → Your Gmail app password (https://myaccount.google.com/apppasswords)
  - `app.base.url=http://` → Your Oracle VM public IP

- [ ] Save file:
  - Press `Ctrl+X`
  - Press `Y`
  - Press `Enter`

---

## 🧪 Step 8: Test Run Backend (2 min)

- [ ] Create uploads directory:
  ```bash
  mkdir -p ~/uploads
  ```

- [ ] Run backend:
  ```bash
  java -jar Placement_Tracker-0.0.1-SNAPSHOT.jar --spring.config.location=application-prod.properties
  ```

- [ ] Watch for success message:
  - ✅ Look for: `Started PlacementTrackerApplication in X.XXX seconds`
  - ❌ If errors appear, check MongoDB connection string and email settings

- [ ] **Test in browser on your PC:**
  - Open: `http://YOUR_PUBLIC_IP:8080/swagger-ui.html`
  - ✅ Swagger UI should load!
  - Try: `http://YOUR_PUBLIC_IP:8080/api/departments`

- [ ] Stop the test (press `Ctrl+C` in VM terminal)

---

## 🚀 Step 9: Setup Permanent Service (3 min)

**Make backend run 24/7 and auto-restart:**

- [ ] Create systemd service:
  ```bash
  sudo nano /etc/systemd/system/placement-tracker.service
  ```

- [ ] Paste this content:

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

- [ ] Save: `Ctrl+X`, `Y`, `Enter`

- [ ] Start service:
  ```bash
  sudo systemctl daemon-reload
  sudo systemctl start placement-tracker
  sudo systemctl enable placement-tracker
  ```

- [ ] Check status:
  ```bash
  sudo systemctl status placement-tracker
  ```
  - ✅ Should show "active (running)" in green

- [ ] View live logs:
  ```bash
  sudo journalctl -u placement-tracker -f
  ```
  - Press `Ctrl+C` to exit log view

---

## ✅ Final Verification

- [ ] **Backend API is accessible:**
  - `http://YOUR_PUBLIC_IP:8080/swagger-ui.html` ✅
  - `http://YOUR_PUBLIC_IP:8080/api/departments` ✅

- [ ] **Service auto-starts on VM reboot:**
  ```bash
  sudo systemctl is-enabled placement-tracker
  ```
  - ✅ Should output: `enabled`

---

## 📝 Information to Share

**When done, provide me with:**

1. **Oracle VM Public IP:** `___.___.___.___`
2. **Backend API endpoint:** `http://YOUR_IP:8080/api`
3. **Test confirmation:** Did Swagger UI load? (Yes/No)

**I'll use this IP to:**
- Configure CORS in backend for Vercel
- Set environment variable in Vercel frontend
- Complete the deployment!

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't SSH to VM | Check if you're using correct IP and key file path |
| Port 8080 not accessible | Verify Step 2 (Security List) was done correctly |
| MongoDB connection failed | Check connection string has correct password and format |
| Service won't start | Check logs: `sudo journalctl -u placement-tracker -n 50` |
| Out of memory | Oracle Free tier has 1GB RAM - should be sufficient |

**Need help?** Share the error message and I'll guide you!

---

## 🎯 Next Steps (After This Checklist)

1. ✅ Share your Oracle VM public IP with me
2. I'll build the frontend
3. I'll update CORS configuration
4. I'll deploy frontend to Vercel
5. 🎉 Full application will be live!
