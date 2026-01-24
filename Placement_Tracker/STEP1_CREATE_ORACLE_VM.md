# 🖥️ Step 1: Create Oracle Cloud VM - Complete Guide

**Goal:** Create a free Ubuntu VM on Oracle Cloud and download SSH key

**Time:** 5 minutes

---

## 📝 Prerequisites

- Oracle Cloud account (Free tier)
- Web browser
- Note-taking app to save your VM's public IP

**Don't have an account?** Sign up at https://www.oracle.com/cloud/free/ (requires credit card for verification but won't charge you)

---

## 🚀 Detailed Steps

### 1. Login to Oracle Cloud Console

1. **Open browser** and go to: https://cloud.oracle.com/
2. Click **"Sign In"** (top right)
3. Enter your **Cloud Account Name** (tenant name)
4. Click **"Next"**
5. Enter your **Username** and **Password**
6. Click **"Sign In"**

✅ You should now see the Oracle Cloud Console dashboard

---

### 2. Navigate to Compute Instances

**Option A - From Dashboard:**
1. Look for the **"Create a VM instance"** quick action card
2. Click the **"Create a VM instance"** button

**Option B - From Menu:**
1. Click the **☰ hamburger menu** (top left)
2. Navigate to: **Compute** → **Instances**
3. Click the blue **"Create instance"** button

---

### 3. Configure Basic Instance Details

You'll see the "Create compute instance" page with several sections:

#### **Name Section:**
- **Name:** Type `placement-tracker-vm`
  - (You can use any name, but this makes it easy to identify)
- **Create in compartment:** Leave as default (usually `root` or your compartment name)

#### **Placement Section:**
- **Availability domain:** Leave as default (usually AD-1, AD-2, or AD-3)
  - Oracle automatically selects one for you

---

### 4. Configure Image and Shape (CRITICAL)

#### **Image:**
1. Under "Image and shape" section, look for the current image (might say "Oracle Linux" by default)
2. Click the **"Edit"** button (or "Change image" link)
3. In the popup:
   - Select **"Canonical Ubuntu"** from the image source dropdown
   - Choose **"22.04"** (full name: Canonical-Ubuntu-22.04-aarch64-* or Canonical-Ubuntu-22.04-x86_64-*)
   - Look for the **"Always Free-eligible"** tag
4. Click **"Select image"** button

#### **Shape:**
1. Click **"Change shape"** button
2. In the shape browser popup:
   - **Instance type:** Select **"Virtual machine"**
   - **Shape series:** Select **"AMD"** or **"Ampere"**
     - AMD: **VM.Standard.E2.1.Micro** (1 OCPU, 1 GB RAM) - x86 architecture
     - Ampere: **VM.Standard.A1.Flex** (4 OCPUs, 24 GB RAM total for free tier)
   - Look for the **"Always Free-eligible"** label
3. For VM.Standard.E2.1.Micro (easiest):
   - OCPU count: **1** (locked)
   - Memory: **1 GB** (locked)
4. Click **"Select shape"** button

**💡 Recommendation:** Use **VM.Standard.E2.1.Micro** - it's simpler and sufficient for this project.

---

### 5. Configure Networking (CRITICAL - MUST HAVE PUBLIC IP)

#### **Primary VNIC information:**

1. **Virtual cloud network:** Leave as default (usually "vcn-...")
   - Oracle creates a default VCN for you automatically

2. **Subnet:** Leave as default (usually "Public Subnet-vcn-...")
   - Make sure it says **"Public Subnet"** - this is important!

3. **❗ Public IPv4 address:**
   - **SELECT: "Assign a public IPv4 address"**
   - ✅ Make sure the checkbox is **CHECKED**
   - This is CRITICAL - without this, you can't access your VM from the internet!

4. Leave all other networking options as default:
   - Private IPv4 address: Automatically assign
   - Public IP address: Ephemeral

---

### 6. Add SSH Keys (CRITICAL - YOU NEED THIS TO LOGIN)

Scroll down to the **"Add SSH keys"** section:

#### **Generate SSH key pair (RECOMMENDED):**

1. Select the radio button: **"Generate a key pair for me"**
2. Click **"Save private key"** button
   - File will download as: `ssh-key-YYYY-MM-DD.key` (date varies)
3. **IMPORTANT:** Rename and save this file securely:
   - Suggested location: `C:\Users\harsh\.ssh\placement-tracker-key.pem`
   - Or: Desktop folder where you can easily find it
   - **⚠️ DO NOT LOSE THIS FILE!** You can't download it again!

4. (Optional) Click **"Save public key"** button if you want to keep it
   - This is optional; you'll rarely need it

#### **Alternative: Upload your own SSH key (Advanced):**
- If you already have an SSH key pair, you can:
  - Select "Upload public key files (.pub)"
  - Or "Paste public keys"
  - Upload/paste your existing public key

**For beginners:** Use the "Generate a key pair for me" option!

---

### 7. Configure Boot Volume (Optional)

Scroll to **"Boot volume"** section:

- **Boot volume size (GB):** Leave as default (**50 GB** - Always Free eligible)
- **Use in-transit encryption:** Leave checked
- All other options: Leave as default

---

### 8. Review and Create

#### **Final Checklist:**

Before clicking Create, verify:

- ✅ Name: `placement-tracker-vm` (or your chosen name)
- ✅ Image: **Canonical Ubuntu 22.04**
- ✅ Shape: **VM.Standard.E2.1.Micro** (Always Free)
- ✅ Network: **Public Subnet** selected
- ✅ **Public IPv4 address: CHECKED** ← CRITICAL!
- ✅ SSH key: Downloaded and saved securely
- ✅ Boot volume: 50 GB

#### **Create the Instance:**

1. Click the blue **"Create"** button at the bottom
2. You'll be redirected to the instance details page
3. Status will show:
   - 🟠 **"PROVISIONING"** (yellow/orange) - Wait 1-2 minutes
   - 🟢 **"RUNNING"** (green) - VM is ready!

---

### 9. Get Your Public IP Address (IMPORTANT)

Once the instance status changes to **RUNNING**:

1. On the instance details page, look for **"Instance information"** section
2. Find **"Public IP address"** field
3. **Copy this IP address** - you'll need it for everything!
   - Example: `158.101.123.45` (yours will be different)
4. **📝 Save this IP somewhere:**
   - Write it down
   - Save in a text file
   - You'll use it multiple times!

---

### 10. Verify Instance Details

Your instance details should look like this:

```
Name: placement-tracker-vm
State: RUNNING (green)
Shape: VM.Standard.E2.1.Micro (Always Free)
OCPU: 1
Memory: 1 GB
Boot volume: 50 GB
Public IP address: XXX.XXX.XXX.XXX  ← SAVE THIS!
Private IP address: 10.0.X.X
```

---

## ✅ Success Checklist

Before proceeding to Step 2, confirm:

- [ ] VM instance is in **RUNNING** state (green)
- [ ] You have the **Public IP address** saved
- [ ] You have the **SSH private key file** (.key or .pem) saved securely
- [ ] You know the location of your SSH key file

---

## 📁 What You Should Have Now

1. **Oracle VM:** Running and accessible
2. **Public IP:** `___.___.___.__` (your actual IP)
3. **SSH Key:** Saved as `placement-tracker-key.pem` (or `.key`)
4. **Key Location:** Example: `C:\Users\harsh\.ssh\placement-tracker-key.pem`

---

## 🆘 Troubleshooting

### Problem: "Create" button is disabled/grayed out

**Solutions:**
- Make sure you selected an "Always Free-eligible" shape
- Check if you exceeded free tier limits (you get 2 free VMs)
- Verify all required fields are filled

---

### Problem: No "Public IP address" option visible

**Solutions:**
- Make sure you selected a **"Public Subnet"** in networking
- Change the subnet dropdown to one that says "Public"
- Check VCN configuration allows public subnets

---

### Problem: "Out of capacity" error

**Solutions:**
- Try a different **Availability Domain** (AD-1, AD-2, or AD-3)
- Go back and change the placement domain
- Try again after a few hours (Oracle free tier capacity varies)

---

### Problem: "Service limit exceeded" error

**Solutions:**
- You might already have 2 Always-Free VMs (limit)
- Go to Compute → Instances and check existing instances
- Delete unused VMs or upgrade to paid tier

---

### Problem: Can't find the SSH key file I downloaded

**Solutions:**
- Check your browser's **Downloads** folder
- Windows: Usually `C:\Users\harsh\Downloads\`
- File name: `ssh-key-YYYY-MM-DD.key`
- You can regenerate by deleting the instance and creating new one

---

## 🎯 Next Steps

**✅ Step 1 Complete!**

Now proceed to: **Step 2 - Open Port 8080** in the main checklist

You'll need:
- Your Public IP address: `___.___.___.__`
- Your SSH key file location

Continue with [ORACLE_CLOUD_SETUP_CHECKLIST.md](ORACLE_CLOUD_SETUP_CHECKLIST.md) - Step 2

---

## 💡 Pro Tips

1. **Save your Public IP immediately** - you'll use it multiple times
2. **Keep SSH key safe** - store backup in cloud storage (Google Drive, OneDrive)
3. **Don't stop the instance** - Oracle Always-Free instances stay free even when running 24/7
4. **Enable Auto-restart** - Instance automatically restarts if VM crashes
5. **Take snapshots** - After successful setup, create boot volume backup

---

## 🔐 Security Note

**Protect your SSH private key:**
- Never share it with anyone
- Don't commit it to Git/GitHub
- Keep backup in secure location
- If lost, you'll need to recreate the VM or use Console connection (advanced)

---

**Ready for Step 2?** Return to [ORACLE_CLOUD_SETUP_CHECKLIST.md](ORACLE_CLOUD_SETUP_CHECKLIST.md)
