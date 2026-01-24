import React, { useState, useEffect, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { authAPI, departmentAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Mentors.css";

// Mentor Card with Gradient Glow Effect
function MentorCard({ mentor, onClick }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (divRef.current) {
      const bounds = divRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - bounds.left, y: e.clientY - bounds.top });
    }
  };

  return (
    <div
      ref={divRef}
      className="mentor-card-wrapper"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={onClick}
    >
      {visible && (
        <div
          className="gradient-glow"
          style={{ top: position.y - 120, left: position.x - 120 }}
        />
      )}
      <div className="mentor-card-content">
        <div className="mentor-avatar">
          {mentor.fullName?.charAt(0).toUpperCase() || "M"}
        </div>
        <h3 className="mentor-name">{mentor.fullName}</h3>
        <p className="mentor-company">
          {mentor.placedCompany || "Company Not Specified"}
        </p>
        <p className="mentor-position">
          {mentor.placedPosition || "Position Not Specified"}
        </p>
        <div className="mentor-details">
          {mentor.departmentName && (
            <span className="detail-tag">{mentor.departmentName}</span>
          )}
          {mentor.placementYear && (
            <span className="detail-tag">Batch {mentor.placementYear}</span>
          )}
        </div>
        <div className="mentor-social-links">
          {mentor.email && (
            <a
              href={`mailto:${mentor.email}`}
              className="social-link email"
              onClick={(e) => e.stopPropagation()}
            >
              Email
            </a>
          )}
          {mentor.linkedinProfile && (
            <a
              href={mentor.linkedinProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link linkedin"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn
            </a>
          )}
        </div>
        <p className="click-hint">Click for details</p>
      </div>
    </div>
  );
}

function Mentors() {
  const { user, isAdmin } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null); // For modal

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mentorRes, deptRes] = await Promise.all([
        authAPI.getAllMentors(),
        departmentAPI.getAll(),
      ]);
      setMentors(mentorRes.data || []);
      setDepartments(deptRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filter dropdowns
  const companies = [
    ...new Set(mentors.map((m) => m.placedCompany).filter(Boolean)),
  ].sort();
  const years = [
    ...new Set(mentors.map((m) => m.placementYear).filter(Boolean)),
  ].sort((a, b) => b - a);

  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch =
      mentor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.placedCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.placedPosition?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCompany =
      !selectedCompany || mentor.placedCompany === selectedCompany;
    const matchesDepartment =
      !selectedDepartment || mentor.departmentName === selectedDepartment;
    const matchesYear =
      !selectedYear || mentor.placementYear?.toString() === selectedYear;

    return matchesSearch && matchesCompany && matchesDepartment && matchesYear;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("");
    setSelectedDepartment("");
    setSelectedYear("");
  };

  // Check if contact info should be visible for a mentor
  const canViewContactInfo = (mentor) => {
    // If visibility is PUBLIC, everyone can see
    if (mentor.contactVisibility !== "ADMIN_ONLY") {
      return true;
    }
    // If ADMIN_ONLY, only admin can see
    return isAdmin && isAdmin();
  };

  if (loading) {
    return (
      <div className="mentors-loading">
        <div className="loader"></div>
        <p>Loading mentors...</p>
      </div>
    );
  }

  return (
    <div className="mentors-page">
      <div className="mentors-header">
        <button
          className="back-link-hero"
          onClick={() => window.history.back()}
        >
          <FiArrowLeft /> Back
        </button>
        <div className="hero-content">
          <h1>Our Mentors</h1>
          <p>
            Connect with placed students who can guide your placement journey
          </p>
        </div>
      </div>

      <div className="mentors-content">
        <div className="search-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search mentors by name, company, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="filter-row">
            <select
              className="filter-select"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.departmentName}>
                  {dept.departmentName}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {(searchTerm ||
              selectedCompany ||
              selectedDepartment ||
              selectedYear) && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredMentors.length > 0 ? (
          <>
            <p className="mentors-count">
              {filteredMentors.length} mentor(s) available
            </p>
            <div className="mentors-grid">
              {filteredMentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onClick={() => setSelectedMentor(mentor)}
                />
              ))}
            </div>

            {/* Mentor Detail Modal - Professional Hero Card */}
            {selectedMentor && (
              <div
                className="mentor-modal-overlay"
                onClick={() => setSelectedMentor(null)}
              >
                <div
                  className="mentor-modal professional-card"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="modal-close"
                    onClick={() => setSelectedMentor(null)}
                  >
                    ×
                  </button>

                  {/* Hero Section */}
                  <div className="modal-hero">
                    <div className="hero-gradient"></div>
                    <div className="hero-content-wrapper">
                      <div className="modal-avatar-large">
                        {selectedMentor.fullName?.charAt(0).toUpperCase() || "M"}
                      </div>
                      <div className="hero-info">
                        <h2 className="hero-name">{selectedMentor.fullName}</h2>
                        <div className="hero-badges">
                          <span className="company-badge">
                            {selectedMentor.placedCompany || "Company Not Specified"}
                          </span>
                          <span className="position-badge">
                            {selectedMentor.placedPosition || "Position Not Specified"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-body">
                    <div className="modal-section">
                      <h4>Details</h4>
                      <div className="detail-row">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">
                          {selectedMentor.departmentName || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Placement Year:</span>
                        <span className="detail-value">
                          {selectedMentor.placementYear || "Not specified"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Graduation Year:</span>
                        <span className="detail-value">
                          {selectedMentor.graduationYear || "Not specified"}
                        </span>
                      </div>
                    </div>

                    <div className="modal-section">
                      <h4>Contact Information</h4>
                      {canViewContactInfo(selectedMentor) ? (
                        <>
                          <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span className="detail-value">
                              {selectedMentor.email ? (
                                <a
                                  href={`mailto:${selectedMentor.email}`}
                                  className="contact-link"
                                >
                                  {selectedMentor.email}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span className="detail-value">
                              {selectedMentor.phoneNumber ? (
                                <a
                                  href={`tel:${selectedMentor.phoneNumber}`}
                                  className="contact-link"
                                >
                                  {selectedMentor.phoneNumber}
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">LinkedIn:</span>
                            <span className="detail-value">
                              {selectedMentor.linkedinProfile ? (
                                <a
                                  href={
                                    selectedMentor.linkedinProfile.startsWith(
                                      "http"
                                    )
                                      ? selectedMentor.linkedinProfile
                                      : `https://${selectedMentor.linkedinProfile}`
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="contact-link"
                                >
                                  View Profile
                                </a>
                              ) : (
                                "Not provided"
                              )}
                            </span>
                          </div>
                        </>
                      ) : (
                        <p className="contact-restricted">
                          Contact information is only visible to administrators.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="modal-actions">
                    {canViewContactInfo(selectedMentor) && (
                      <>
                        {selectedMentor.email && (
                          <a
                            href={`mailto:${selectedMentor.email}`}
                            className="action-btn email-btn"
                          >
                            Send Email
                          </a>
                        )}
                        {selectedMentor.phoneNumber && (
                          <a
                            href={`tel:${selectedMentor.phoneNumber}`}
                            className="action-btn call-btn"
                          >
                            Call Now
                          </a>
                        )}
                        {selectedMentor.linkedinProfile && (
                          <a
                            href={
                              selectedMentor.linkedinProfile.startsWith("http")
                                ? selectedMentor.linkedinProfile
                                : `https://${selectedMentor.linkedinProfile}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn linkedin-btn"
                          >
                            LinkedIn
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mentors-empty">
            <div className="empty-icon-box">M</div>
            <h3>No Mentors Yet</h3>
            <p>
              Be the first to register as a mentor and help fellow students!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mentors;
