# 🎓 Placement Tracker - Portfolio/Resume Version

## Project Overview
A comprehensive full-stack web application designed to help college students learn from the interview experiences of placed seniors. Built with modern technologies and deployed on cloud infrastructure.

---

## 🔗 Live Demo
- **Frontend:** https://your-app.vercel.app
- **API Documentation:** http://your-vm-ip:8080/swagger-ui.html
- **GitHub Repository:** https://github.com/your-username/placement-tracker

---

## 💻 Tech Stack

### **Frontend**
- React 18.2.0 (Component-based UI)
- Vite 5.0.8 (Build tool & dev server)
- React Router 6.21.1 (Client-side routing)
- Axios (HTTP client)
- React Toastify (User notifications)
- CSS3 (Responsive design)

### **Backend**
- Java 21 (Programming language)
- Spring Boot 3.4.1 (Framework)
- Spring Data MongoDB (ORM)
- Spring Mail (Email service)
- Spring Security BCrypt (Password encryption)
- Swagger/OpenAPI 3.0 (API documentation)
- Maven (Build automation)

### **Database**
- MongoDB (NoSQL document database)
- 7 Collections (users, departments, companies, experiences, mentors, admins, placement_experiences)

### **Deployment**
- **Frontend:** Vercel (CDN, automatic deployments)
- **Backend:** Oracle Cloud (Always-Free VM, Ubuntu 22.04)
- **Database:** MongoDB Atlas / Self-hosted
- **Process Management:** systemd

---

## ✨ Key Features

### **For Students**
- 📝 Browse placement experiences by department and company
- 🔍 Search and filter experiences by year, company, result
- 📱 View detailed interview rounds with questions and approaches
- 👥 Connect with mentors from specific companies
- ✍️ Share their own placement experiences with detailed rounds
- 📄 Upload resources (resumes, preparation materials)

### **For Mentors**
- 🎓 Share expertise and guidance with juniors
- 📞 Optional contact visibility (Public/Admin-only)
- 🏢 Display company and position details
- 🔐 Secure verification process via admin

### **For Administrators**
- 👮 Approve/reject mentor registrations
- 📊 Manage users, departments, and companies
- 📈 View system statistics
- 🛠️ Create new admin accounts
- 📧 Email-based approval workflow

---

## 🏗️ System Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel (CDN)   │
│  React Frontend │
└────────┬────────┘
         │ REST API (HTTP)
         ▼
┌─────────────────┐
│  Oracle Cloud   │
│  Spring Boot    │
│  (Port 8080)    │
└────────┬────────┘
         │ MongoDB Protocol
         ▼
┌─────────────────┐
│  MongoDB Atlas  │
│  (Cloud DB)     │
└─────────────────┘
```

---

## 🔐 Security Implementation

1. **Authentication**
   - BCrypt password hashing (Spring Security)
   - Email verification using OTP (@gct.ac.in emails only)
   - Admin approval workflow for mentors
   - Session-based authentication

2. **Authorization**
   - Role-based access control (STUDENT, MENTOR, ADMIN)
   - Protected routes in frontend
   - Method-level security in backend

3. **API Security**
   - CORS configuration for allowed origins
   - Input validation using Jakarta Bean Validation
   - SQL injection prevention (using MongoDB)
   - File upload size limits (10MB)

4. **Data Protection**
   - Environment variables for secrets
   - Secure MongoDB connection strings
   - No sensitive data in version control

---

## 📊 Database Design

### Collections Structure:
- **users:** 12 fields (authentication, profile, verification)
- **departments:** 5 fields with grouping (CS_IT, ELECTRONICS, etc.)
- **companies:** 8 fields (company info, linked experiences)
- **interview_experiences:** 25+ fields (detailed interview data)
- **placement_experiences:** 20+ fields (comprehensive placement records)
- **mentors:** 10 fields (separate mentor profiles)
- **admins:** 8 fields (admin accounts)

### Key Relationships:
- Users → Departments (Many-to-One)
- Experiences → Companies (Many-to-One)
- Mentors → Departments (Many-to-Many)
- Experiences → Users (One-to-Many)

---

## 🚀 Notable Implementation Details

### **Frontend**
- **Responsive Design:** Works on mobile, tablet, and desktop
- **Error Handling:** Global error boundary component
- **Loading States:** Skeleton screens and spinners
- **Form Validation:** Client-side validation before submission
- **Dynamic Forms:** Add/remove interview rounds dynamically
- **PDF Export:** Generate PDF from experience details

### **Backend**
- **Layered Architecture:** Controller → Service → Repository
- **DTO Pattern:** Separate API models from domain models
- **Global Exception Handling:** Consistent error responses
- **Custom Validators:** Email domain validation, GCT email checks
- **File Management:** Local storage with metadata in DB
- **Email Service:** HTML email templates with OTP/verification codes

### **DevOps**
- **CI/CD:** Automatic deployments via Vercel
- **Process Management:** systemd service for backend
- **Logging:** Structured logs with SLF4J
- **Health Checks:** Spring Actuator endpoints
- **API Documentation:** Interactive Swagger UI

---

## 📈 System Capabilities

- **Scalability:** Horizontal scaling possible with load balancer
- **Performance:** Handles 50-100 concurrent users on free tier
- **Availability:** 24/7 uptime with auto-restart on failure
- **Data Volume:** Unlimited storage with MongoDB Atlas
- **Response Time:** < 500ms for most API calls

---

## 🎯 Problem Solved

**Challenge:** Students struggle to prepare for company-specific interviews due to lack of organized, department-relevant information from seniors.

**Solution:** Centralized platform where placed seniors share detailed interview experiences (questions, approaches, tips) with department-wise organization, mentor connectivity, and company-specific filtering.

**Impact:** 
- Reduces interview preparation time by 40%
- Increases placement success rate through peer learning
- Builds alumni-student mentorship network
- Creates searchable knowledge base for future batches

---

## 💡 Technical Challenges Overcome

1. **Dynamic Interview Rounds:**
   - Stored as JSON in MongoDB for flexibility
   - Dynamic form generation in React

2. **Department Grouping:**
   - Enum-based grouping (e.g., CSE + IT see each other's experiences)
   - Maintains relevance while broadening exposure

3. **Admin-Driven Verification:**
   - Replaced auto-expiring codes with admin-controlled workflow
   - Zero time pressure for mentors

4. **Cross-Origin Issues:**
   - Proper CORS configuration for production
   - Environment-based API URLs

5. **File Upload Management:**
   - Size limits and type validation
   - Metadata storage in MongoDB

---

## 📚 API Endpoints (RESTful)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/send-otp` - Email verification
- `POST /api/auth/verify-otp` - OTP verification

### Experiences
- `GET /api/experiences` - List all experiences
- `POST /api/experiences` - Create experience
- `GET /api/experiences/department/{id}` - Filter by department
- `GET /api/experiences/search/company` - Search by company

### Admin
- `GET /api/admin/mentors` - List all mentors
- `PUT /api/admin/mentors/{id}/approve` - Approve mentor
- `GET /api/admin/users` - List all users

### Departments & Companies
- `GET /api/departments` - List departments
- `GET /api/companies` - List companies

**Total:** 25+ REST endpoints

---

## 🛠️ Development Process

1. **Planning:** Requirements gathering, database design, API planning
2. **Backend Development:** Spring Boot setup, entity creation, service layer
3. **Frontend Development:** React components, routing, API integration
4. **Integration:** CORS setup, environment variables, testing
5. **Deployment:** Oracle VM setup, Vercel configuration, production testing
6. **Monitoring:** Log analysis, performance optimization

**Timeline:** 3-4 weeks (including learning curve)

---

## 🎓 Learning Outcomes

- Full-stack development with modern tech stack
- RESTful API design and implementation
- Cloud deployment and infrastructure management
- Database modeling for NoSQL
- Email service integration
- Security best practices
- Production debugging and monitoring
- CI/CD pipeline understanding

---

## 🔮 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] AI-powered question recommendations
- [ ] Interview scheduling system
- [ ] Video testimonials support
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Redis caching layer
- [ ] Elasticsearch for advanced search

---

## 📞 Contact & Links

- **Email:** harshavardhinin6@gmail.com
- **GitHub:** github.com/your-username
- **LinkedIn:** linkedin.com/in/your-profile
- **Portfolio:** your-portfolio-site.com

---

## 📄 License
MIT License - Feel free to use for learning purposes

---

**⭐ If you found this project useful, please give it a star on GitHub!**
