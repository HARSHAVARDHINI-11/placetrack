# Interview Questions & Answers - Placement Tracker Deployment

## 🎯 Architecture Questions

### Q: Explain your project architecture
**A:** "My application follows a three-tier architecture. The presentation layer is a React + Vite frontend deployed on Vercel for optimal performance and global CDN delivery. The business logic layer is a Spring Boot REST API hosted on an Oracle Cloud Always-Free VM, handling authentication, CRUD operations, and business rules. The data layer uses MongoDB for flexible document storage, perfect for our varying experience formats. All communication happens via RESTful APIs over HTTP/HTTPS."

### Q: Why did you choose this tech stack?
**A:** "I chose React for its component-based architecture and virtual DOM for fast rendering. Spring Boot provides production-ready features like auto-configuration and embedded Tomcat. MongoDB offers schema flexibility for storing diverse interview experiences. Oracle Cloud provides reliable free-tier infrastructure, and Vercel enables automatic deployments with zero configuration."

---

## 🔧 Deployment Questions

### Q: How did you deploy your application?
**A:** "The backend JAR is deployed on Oracle Cloud using systemd for process management and auto-restart capabilities. I configured the VM with proper security rules, opened port 8080, and set up a systemd service that ensures 24/7 availability. The frontend is deployed on Vercel with automatic CI/CD from GitHub. I used environment variables to manage configuration between development and production."

### Q: How do you handle CORS in production?
**A:** "I implemented a CorsConfig class using Spring's CorsConfiguration. In development, it allows localhost origins. For production, I specifically whitelist my Vercel domain and enable credentials. This prevents unauthorized cross-origin requests while allowing legitimate frontend-backend communication. The configuration includes allowed methods (GET, POST, PUT, DELETE), headers, and exposes necessary headers for the client."

### Q: Explain your MongoDB connection strategy
**A:** "I use MongoDB Atlas for cloud-hosted database with automatic backups and scaling. The connection string is externalized in application.properties with environment-specific configurations. For production, I whitelist the Oracle VM IP in Atlas security settings. The connection uses mongodb+srv protocol with authentication. Spring Data MongoDB handles connection pooling and automatic retries."

---

## 🔐 Security Questions

### Q: How do you secure your application?
**A:** 
1. "Password encryption using BCrypt (Spring Security)"
2. "CORS policies to prevent unauthorized access"
3. "GCT email verification using OTP for registration"
4. "Admin approval workflow for mentors"
5. "Environment variables for sensitive data (never hardcoded)"
6. "Input validation using Jakarta Bean Validation"
7. "MongoDB connection with authentication"
8. "File upload size limits and type validation"

### Q: How do you handle sensitive configuration?
**A:** "All sensitive data like database credentials, email passwords, and API keys are stored in environment variables or external configuration files. In development, I use application.properties. For production, I use a separate application-prod.properties file on the server that's not committed to version control. The Vercel frontend uses environment variables for the API URL."

---

## 🐛 Troubleshooting Questions

### Q: How do you debug issues in production?
**A:** 
1. "Backend logs via systemd: `journalctl -u placement-tracker -f`"
2. "Application logging with SLF4J and Logback"
3. "Vercel deployment logs in dashboard"
4. "Browser developer console for frontend issues"
5. "MongoDB Atlas monitoring for database performance"
6. "Spring Boot Actuator endpoints for health checks"

### Q: What if the backend goes down?
**A:** "The systemd service is configured with `Restart=on-failure` and `RestartSec=10`, so it automatically restarts. I monitor logs regularly and have set up basic health checks. For critical issues, I can SSH to the VM, check logs, and manually restart the service. The Oracle VM is on the Always-Free tier, so it has consistent uptime."

---

## 📊 Performance Questions

### Q: How do you optimize performance?
**A:**
- **Frontend:** Vite's code splitting, lazy loading components, React.memo for preventing unnecessary re-renders
- **Backend:** Spring Boot's built-in caching, MongoDB indexing on frequently queried fields
- **Network:** Vercel CDN for static assets, CORS preflight caching
- **Database:** MongoDB compound indexes on department+year queries

### Q: How many users can your system handle?
**A:** "Currently, the Oracle Always-Free VM (1GB RAM, 1 OCPU) can handle approximately 50-100 concurrent users with proper connection pooling. The architecture is horizontally scalable - I can add more VMs behind a load balancer. MongoDB Atlas can scale independently. For a college placement system with ~2000 students, this is more than sufficient as they won't all be active simultaneously."

---

## 🚀 CI/CD Questions

### Q: How do you deploy updates?
**A:**
- **Frontend:** Push to GitHub → Vercel auto-deploys (CI/CD)
- **Backend:** Build JAR locally → SCP to VM → Restart systemd service
- "For future improvements, I'd set up GitHub Actions to automate backend deployment as well."

### Q: What's your rollback strategy?
**A:** "For frontend, Vercel maintains deployment history - I can rollback to any previous deployment with one click. For backend, I keep previous JAR versions on the VM with version numbers. If something breaks, I can restart the service with the previous JAR file. MongoDB Atlas provides point-in-time backup recovery."

---

## 💡 Advanced Questions

### Q: How would you add HTTPS to your backend?
**A:** "I would set up Nginx as a reverse proxy on the Oracle VM, configure it to forward requests from port 443 to port 8080, and use Let's Encrypt certbot to obtain a free SSL certificate. Then update the Vercel environment variable to use `https://` instead of `http://`. This adds encryption in transit and improves security."

### Q: How would you implement rate limiting?
**A:** "I'd use Spring's RateLimiter with Resilience4j or implement a custom interceptor with Redis for distributed rate limiting. Set limits like 100 requests per minute per IP for API endpoints. For file uploads, implement token bucket algorithm. This prevents abuse and ensures fair resource allocation."

### Q: What monitoring would you add?
**A:** 
1. "Application Performance Monitoring (APM) like New Relic or Elastic APM"
2. "Log aggregation with ELK stack (Elasticsearch, Logstack, Kibana)"
3. "Uptime monitoring with UptimeRobot"
4. "Error tracking with Sentry"
5. "MongoDB Atlas built-in monitoring for query performance"
6. "Custom health check endpoint: `/actuator/health`"

---

## 🎓 Feature Questions

### Q: Walk me through your mentor approval workflow
**A:** "When a mentor registers, the system generates a secure token and sends an email to the admin with the mentor's details and an approval link. The admin clicks the link, which triggers the backend to generate a 6-digit verification code sent to the mentor's email. The code never expires, giving mentors flexibility. Once verified, they're synced to the mentors collection and can access the platform. This ensures only legitimate mentors join while removing time pressure."

### Q: How do you handle file uploads?
**A:** "Files are uploaded to the server's file system in a dedicated `uploads/` directory. I use Spring's MultipartFile with size limits (10MB max). The file metadata (name, size, path) is stored in MongoDB. For production, I'd migrate to cloud storage like AWS S3 or Azure Blob Storage for better scalability and durability."

### Q: Explain your department grouping feature
**A:** "I created a DepartmentGroup enum (CS_IT, ELECTRONICS, MECHANICAL, etc.) in the Department entity. Related departments like CSE and IT share the same group. When a student from CSE views experiences, the backend filters by their department group, showing experiences from both CSE and IT. This gives students broader insights while maintaining relevance."

---

## 📝 Best Practices to Mention

1. **"I follow REST API conventions with proper HTTP status codes"**
2. **"Used DTO pattern to separate API layer from domain layer"**
3. **"Implemented global exception handling for consistent error responses"**
4. **"Followed clean code principles with meaningful names and comments"**
5. **"Used Lombok to reduce boilerplate code"**
6. **"Configured Swagger for API documentation"**
7. **"Separated concerns with layered architecture (Controller-Service-Repository)"**
8. **"Used dependency injection for loose coupling"**

---

## 🎯 Closing Statement

*"This project gave me hands-on experience with full-stack development, cloud deployment, and production best practices. I learned about scalability challenges, security considerations, and real-world system design. The most valuable lesson was understanding the gap between development and production environments, and how to bridge that gap with proper configuration management and monitoring."*

---

**Remember:** Speak confidently, admit when you don't know something, and show eagerness to learn. Explain your reasoning and trade-offs you considered!
