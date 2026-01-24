# 🧪 Complete Testing Guide - Placement Tracker

## ✅ Current Setup:
- **Backend:** http://localhost:8080 (JAR + MongoDB Atlas)
- **Frontend:** http://localhost:3000 (Production build)
- **Email:** harshavardhinin6@gmail.com

---

## 📋 PART 1: Backend API Testing

### Test 1.1: Departments API
```
URL: http://localhost:8080/api/departments
Method: GET
Expected: 200 OK with JSON array of departments
```

**Test Steps:**
1. Open URL in browser
2. ✅ Should see: `[{"id":"...","departmentName":"Computer Science and Engineering",...}]`

---

### Test 1.2: Experiences API
```
URL: http://localhost:8080/api/experiences
Method: GET
Expected: 200 OK with experiences array (empty or with data)
```

---

### Test 1.3: API Health Check
```
URLs to test:
- http://localhost:8080/api/students
- http://localhost:8080/api/mentors
- http://localhost:8080/api/companies
```

**All should return 200 OK or 401 Unauthorized (both are valid - means API is working)**

---

## 📋 PART 2: Frontend UI Testing

### Test 2.1: Homepage Load
```
URL: http://localhost:3000
```

**Test Steps:**
1. Open URL in browser
2. ✅ Homepage loads with navigation bar
3. ✅ See "Placement Tracker" or logo
4. ✅ Menu items: Home, Departments, Experiences, Login, Register

---

### Test 2.2: Departments Page
**Steps:**
1. Click "Departments" in menu
2. ✅ List of departments loads
3. ✅ See CSE, IT, ECE, EEE, MECH, etc.
4. ✅ Each department shows description
5. Click on a department
6. ✅ Department details page opens
7. ✅ Shows students/experiences from that department

---

### Test 2.3: Experiences Page
**Steps:**
1. Click "Experiences" in menu
2. ✅ List of placement experiences loads
3. ✅ Each card shows: Company, Role, Package, Student name
4. Click "View Details" on any experience
5. ✅ Full details page opens
6. ✅ Shows interview process, tips, resources

---

## 📋 PART 3: Student Registration & Login Flow

### Test 3.1: Student Registration
**Steps:**
1. Go to http://localhost:3000
2. Click "Register" or "Sign Up"
3. Select "Student" role
4. Fill form:
   - **Name:** Test Student
   - **Email:** teststudent@gct.ac.in (must end with @gct.ac.in)
   - **Password:** Test@123
   - **Roll Number:** 123456
   - **Department:** Select any (e.g., CSE)
   - **Year:** Select any (e.g., 4th Year)
   - **Phone:** 9876543210
5. Click "Register" or "Submit"
6. ✅ Success message: "Registration successful! Check email for OTP"

---

### Test 3.2: Email OTP Verification
**Steps:**
1. Open Gmail: harshavardhinin6@gmail.com
2. ✅ Find email with subject like "Placement Tracker - Email Verification"
3. ✅ Email contains 6-digit OTP code
4. Copy the OTP (e.g., 123456)

---

### Test 3.3: Enter OTP & Verify
**Steps:**
1. Browser should show OTP verification page
2. Enter the 6-digit OTP from email
3. Click "Verify"
4. ✅ Success message: "Email verified successfully!"
5. ✅ Redirected to login page

---

### Test 3.4: Student Login
**Steps:**
1. Go to login page or click "Login"
2. Enter credentials:
   - **Email:** teststudent@gct.ac.in
   - **Password:** Test@123
3. Click "Login"
4. ✅ Redirected to Student Dashboard
5. ✅ See welcome message with student name
6. ✅ Navigation shows: Dashboard, Add Experience, Profile, Logout

---

## 📋 PART 4: Student Dashboard Testing

### Test 4.1: View Student Dashboard
**Steps:**
1. After login, on dashboard
2. ✅ See statistics: Total Experiences, Companies, Average Package
3. ✅ See recent experiences
4. ✅ See profile summary

---

### Test 4.2: Add Placement Experience
**Steps:**
1. Click "Add Experience" or "+" button
2. Fill form:
   - **Company Name:** Google
   - **Role:** Software Engineer
   - **Package:** 25 LPA
   - **Location:** Bangalore
   - **Job Type:** Full-time
   - **Offer Date:** Select date
   - **Interview Process:** Describe rounds
   - **Tips:** Share interview tips
   - **Resume:** Click "Upload Resume" → Select PDF file
3. Click "Submit" or "Save"
4. ✅ Success message: "Experience added successfully!"
5. ✅ Redirected to experiences list
6. ✅ New experience appears in list

---

### Test 4.3: View My Experiences
**Steps:**
1. Go to "My Experiences" or "Profile"
2. ✅ See list of experiences you added
3. Click "Edit" on any experience
4. ✅ Edit form opens with existing data
5. Modify any field (e.g., change package to 30 LPA)
6. Click "Update"
7. ✅ Success message: "Experience updated!"

---

### Test 4.4: Delete Experience
**Steps:**
1. On experience list, click "Delete" button
2. ✅ Confirmation dialog: "Are you sure?"
3. Click "Confirm"
4. ✅ Success message: "Experience deleted!"
5. ✅ Experience removed from list

---

### Test 4.5: Update Profile
**Steps:**
1. Click "Profile" in menu
2. ✅ See current profile details
3. Click "Edit Profile"
4. Modify fields (e.g., phone number, bio)
5. Click "Update Profile"
6. ✅ Success message: "Profile updated!"
7. ✅ Changes reflected on profile page

---

## 📋 PART 5: Mentor Registration & Login Flow

### Test 5.1: Mentor Registration
**Steps:**
1. Logout (click "Logout")
2. Click "Register"
3. Select "Mentor" role
4. Fill form:
   - **Name:** Test Mentor
   - **Email:** testmentor@gct.ac.in
   - **Password:** Mentor@123
   - **Department:** Select any
   - **Designation:** Assistant Professor
   - **Phone:** 9876543211
5. Click "Register"
6. ✅ Success message: "Registration successful! Verification code sent to email"

---

### Test 5.2: Mentor Email Verification
**Steps:**
1. Check email: harshavardhinin6@gmail.com
2. ✅ Find "Mentor Verification Code" email
3. ✅ Email contains verification code (e.g., ABC123)
4. Copy the code

---

### Test 5.3: Enter Mentor Verification Code
**Steps:**
1. On verification page, enter code from email
2. Click "Verify"
3. ✅ Message: "Verification code submitted! Wait for admin approval"
4. ✅ Account status: Pending Approval

---

## 📋 PART 6: Admin Testing

### Test 6.1: Admin Login
**Steps:**
1. Logout from any account
2. Go to: http://localhost:3000/admin/login
3. Enter admin credentials:
   - **Email:** admin@gct.ac.in
   - **Password:** Admin@123
4. Click "Login"
5. ✅ Redirected to Admin Dashboard
6. ✅ See: Pending Mentors, Total Students, Total Experiences

---

### Test 6.2: Approve Mentor
**Steps:**
1. On Admin Dashboard
2. Go to "Pending Mentors" section
3. ✅ See list of mentors waiting for approval
4. ✅ See "Test Mentor" from previous registration
5. Click "Approve" button
6. ✅ Success message: "Mentor approved!"
7. ✅ Notification email sent to mentor

---

### Test 6.3: Mentor Login After Approval
**Steps:**
1. Logout from admin
2. Login as mentor:
   - **Email:** testmentor@gct.ac.in
   - **Password:** Mentor@123
3. ✅ Login successful
4. ✅ Redirected to Mentor Dashboard
5. ✅ See: Students list, Experiences to verify

---

## 📋 PART 7: File Upload Testing

### Test 7.1: Resume Upload (Student)
**Steps:**
1. Login as student
2. Add new experience or edit existing
3. Click "Upload Resume" button
4. Select a PDF file (< 10MB)
5. ✅ File name appears
6. ✅ Upload progress shown (if large file)
7. Submit form
8. ✅ Resume uploaded successfully
9. View experience details
10. ✅ "Download Resume" button appears
11. Click download
12. ✅ Resume PDF downloads

---

### Test 7.2: Profile Picture Upload
**Steps:**
1. Go to Profile page
2. Click "Upload Picture" or camera icon
3. Select image file (JPG/PNG < 5MB)
4. ✅ Preview shown
5. Click "Save"
6. ✅ Profile picture updated
7. ✅ New picture shows in navbar/header

---

## 📋 PART 8: Search & Filter Testing

### Test 8.1: Search Experiences by Company
**Steps:**
1. Go to Experiences page
2. ✅ See search box
3. Type company name: "Google"
4. ✅ Results filter in real-time
5. ✅ Only Google experiences shown
6. Clear search
7. ✅ All experiences return

---

### Test 8.2: Filter by Department
**Steps:**
1. On Experiences page
2. Select department filter: "CSE"
3. ✅ Only CSE student experiences shown
4. Change to "IT"
5. ✅ Results update to IT students
6. Select "All Departments"
7. ✅ All experiences shown

---

### Test 8.3: Filter by Package Range
**Steps:**
1. On Experiences page
2. Use package filter/slider
3. Set minimum: 10 LPA
4. ✅ Only experiences with package >= 10 LPA shown
5. Set maximum: 20 LPA
6. ✅ Experiences between 10-20 LPA shown

---

## 📋 PART 9: Responsive Design Testing

### Test 9.1: Mobile View (Chrome DevTools)
**Steps:**
1. Press F12 in browser
2. Click mobile/tablet icon (top left)
3. Select device: "iPhone 12 Pro"
4. ✅ Layout adjusts to mobile view
5. ✅ Navigation becomes hamburger menu
6. ✅ Cards stack vertically
7. ✅ Forms are mobile-friendly
8. Test all pages (Home, Departments, Experiences)

---

### Test 9.2: Tablet View
**Steps:**
1. In DevTools, select "iPad"
2. ✅ Layout adjusts appropriately
3. ✅ 2-column grid for cards
4. ✅ All features accessible

---

## 📋 PART 10: Error Handling Testing

### Test 10.1: Invalid Login
**Steps:**
1. Go to Login page
2. Enter wrong password
3. Click Login
4. ✅ Error message: "Invalid credentials"
5. ✅ Stays on login page
6. ✅ No crash or blank screen

---

### Test 10.2: Duplicate Email Registration
**Steps:**
1. Try to register with already used email
2. Click Register
3. ✅ Error message: "Email already exists"
4. ✅ Form stays filled (except password)

---

### Test 10.3: Network Error Simulation
**Steps:**
1. Open DevTools → Network tab
2. Change to "Offline"
3. Try to load experiences page
4. ✅ Error message: "Network error" or "Cannot connect"
5. Change back to "Online"
6. Reload page
7. ✅ Works normally

---

## 📋 PART 11: Security Testing

### Test 11.1: Protected Routes
**Steps:**
1. Logout completely
2. Try to access: http://localhost:3000/dashboard
3. ✅ Redirected to login page
4. Try: http://localhost:3000/add-experience
5. ✅ Redirected to login page
6. Login
7. ✅ Can access protected pages

---

### Test 11.2: Role-Based Access
**Steps:**
1. Login as Student
2. Try to access: http://localhost:3000/admin
3. ✅ Access denied or redirected
4. Logout, login as Admin
5. ✅ Can access admin pages

---

### Test 11.3: Session Timeout
**Steps:**
1. Login and stay idle for 30 minutes
2. Try to perform action (add experience)
3. ✅ Session expired message
4. ✅ Redirected to login
5. Login again
6. ✅ Can continue working

---

## 📋 PART 12: Email Notifications Testing

### Test 12.1: Registration OTP Email
**Check Email Contains:**
- ✅ Subject: "Email Verification - Placement Tracker"
- ✅ 6-digit OTP code
- ✅ Expiry time (usually 10 minutes)
- ✅ Professional formatting

---

### Test 12.2: Mentor Approval Email
**Check Email Contains:**
- ✅ Subject: "Mentor Account Approved"
- ✅ Congratulations message
- ✅ Login instructions
- ✅ Link to login page

---

### Test 12.3: Password Reset Email (if implemented)
**Steps:**
1. Click "Forgot Password"
2. Enter email
3. ✅ Email received with reset link
4. Click link
5. ✅ Redirected to reset password page

---

## 📋 PART 13: Database Verification

### Test 13.1: Check MongoDB Atlas
**Steps:**
1. Login to MongoDB Atlas: https://cloud.mongodb.com
2. Go to Clusters → Browse Collections
3. Database: `placement_tracker_db`
4. Check collections:
   - ✅ `users` - contains students, mentors, admin
   - ✅ `experiences` - contains placement experiences
   - ✅ `departments` - contains department list
   - ✅ `companies` - contains company data

---

### Test 13.2: Verify Data Consistency
**Steps:**
1. Add experience from frontend
2. Check MongoDB `experiences` collection
3. ✅ New document appears with correct data
4. Edit experience from frontend
5. Refresh MongoDB
6. ✅ Document updated with changes
7. Delete experience
8. ✅ Document removed from database

---

## 📋 PART 14: Performance Testing

### Test 14.1: Page Load Time
**Steps:**
1. Open DevTools → Network tab
2. Clear cache (Ctrl+Shift+Delete)
3. Reload homepage
4. Check "Load" time at bottom
5. ✅ Should be < 3 seconds
6. Subsequent loads should be < 1 second

---

### Test 14.2: Large Dataset Handling
**Steps:**
1. View experiences page with 50+ experiences
2. ✅ Page loads without lag
3. ✅ Scroll is smooth
4. ✅ Search/filter works fast

---

## 📋 PART 15: Cross-Browser Testing

### Test 15.1: Chrome (Already Tested)
✅ All features working

### Test 15.2: Firefox
**Steps:**
1. Open http://localhost:3000 in Firefox
2. Test login, registration, add experience
3. ✅ All features work same as Chrome

### Test 15.3: Microsoft Edge
**Steps:**
1. Open http://localhost:3000 in Edge
2. Test key features
3. ✅ All features work correctly

---

## 🎯 Testing Summary Checklist

### ✅ Backend APIs (6 tests)
- [ ] GET /api/departments
- [ ] GET /api/experiences
- [ ] GET /api/students
- [ ] GET /api/mentors
- [ ] POST /api/auth/register
- [ ] POST /api/auth/login

### ✅ Frontend UI (5 pages)
- [ ] Homepage loads
- [ ] Departments page
- [ ] Experiences page
- [ ] Login page
- [ ] Register page

### ✅ User Flows (3 roles)
- [ ] Student registration → OTP → Login → Dashboard
- [ ] Mentor registration → Code → Approval → Login
- [ ] Admin login → Approve mentors

### ✅ CRUD Operations (3 features)
- [ ] Create experience
- [ ] Read/View experiences
- [ ] Update experience
- [ ] Delete experience

### ✅ File Uploads (2 types)
- [ ] Resume upload (PDF)
- [ ] Profile picture upload (Image)

### ✅ Search & Filter (3 filters)
- [ ] Search by company name
- [ ] Filter by department
- [ ] Filter by package range

### ✅ Security (3 checks)
- [ ] Protected routes redirect to login
- [ ] Role-based access control
- [ ] Session management

### ✅ Email Notifications (2 types)
- [ ] OTP verification email
- [ ] Mentor approval email

### ✅ Responsive Design (2 devices)
- [ ] Mobile view (< 768px)
- [ ] Tablet view (768-1024px)

### ✅ Error Handling (3 scenarios)
- [ ] Invalid login shows error
- [ ] Duplicate email shows error
- [ ] Network errors handled gracefully

---

## 🚀 Quick Test Command List

```bash
# Backend API Tests (run in browser)
http://localhost:8080/api/departments
http://localhost:8080/api/experiences
http://localhost:8080/api/students

# Frontend Pages (run in browser)
http://localhost:3000/
http://localhost:3000/departments
http://localhost:3000/experiences
http://localhost:3000/login
http://localhost:3000/register

# Admin Pages
http://localhost:3000/admin/login
http://localhost:3000/admin/dashboard
```

---

## ✅ Testing Complete!

**If all tests pass:**
🎉 Your application is production-ready!
🚀 Ready for cloud deployment!

**If any test fails:**
1. Note which test failed
2. Check browser console (F12) for errors
3. Check backend logs for API errors
4. Share error details for debugging

---

## 📊 Expected Test Results

| Test Category | Total Tests | Should Pass |
|--------------|-------------|-------------|
| Backend APIs | 6 | 6 (100%) |
| Frontend UI | 5 | 5 (100%) |
| User Flows | 3 | 3 (100%) |
| CRUD Operations | 4 | 4 (100%) |
| File Uploads | 2 | 2 (100%) |
| Search/Filter | 3 | 3 (100%) |
| Security | 3 | 3 (100%) |
| Email Notifications | 2 | 2 (100%) |
| Responsive Design | 2 | 2 (100%) |
| Error Handling | 3 | 3 (100%) |
| **TOTAL** | **33** | **33 (100%)** |

---

**Start testing now:** http://localhost:3000 🧪
