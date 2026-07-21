import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../../components/common';
import { useAuth } from '../../hooks/useAuth';
import { saveUserProfile, uploadResume } from '../../services/api';
import { 
  User, Award, Briefcase, FileText, CheckCircle, ArrowRight, ArrowLeft, 
  Upload, Trash2, Plus, Brain, Sparkles, Building, Code, ShieldAlert
} from 'lucide-react';
import './Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  
  // Current active step: 1 to 6
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: user?.name || '',
    age: '',
    college: '',
    department: '',
    degree: '',
    currentYear: '',
    currentSemester: '',
    cgpa: '',
    
    // Step 2: Skills
    skills: [],
    
    // Step 3: Projects
    projects: [],
    
    // Step 4: Resume
    resumeUrl: '',
    resumeFileName: '',
    
    // Step 5: Certifications
    hasCertifications: false,
    certifications: [],
    
    // Step 6: Career Goals
    dreamJob: '',
    dreamCompany: ''
  });

  // Temporary inputs for lists (projects, certifications)
  const [tempProject, setTempProject] = useState({ title: '', description: '' });
  const [tempCert, setTempCert] = useState({ name: '', issuingOrg: '', date: '' });
  
  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form Validation Errors
  const [errors, setErrors] = useState({});

  // Loading texts array for cycling
  const loadingTexts = [
    "Analyzing your profile...",
    "Scanning job market data...",
    "Calculating your readiness score...",
    "Building your personalized roadmap..."
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // Cycle loading texts every 1 second during 4 seconds loading screen
  useEffect(() => {
    let interval;
    if (isAnalyzing) {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex(prev => (prev + 1) % loadingTexts.length);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAnalyzing]);

  // Skill Options
  const skillOptions = ['Programming', 'Database', 'Analytics', 'AI', 'Cloud', 'Soft Skills'];

  // Dream Job Roles
  const jobRoles = [
    'Software Engineer', 'Data Analyst', 'Data Scientist', 
    'Business Analyst', 'Cloud Engineer', 'DevOps Engineer', 
    'AI/ML Engineer', 'Cybersecurity Analyst', 
    'Full Stack Developer', 'Product Manager'
  ];

  // Dream Companies
  const companies = [
    'Zoho', 'Accenture', 'Amazon', 'Google', 'Microsoft', 'IBM', 
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Deloitte', 'Capgemini', 
    'Oracle', 'Adobe', 'Salesforce', 'Freshworks', 'Tiger Analytics', 
    'HCLTech', 'Flipkart', 'PayPal'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Toggle skill selection
  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const skills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
    
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  // Step 3: Projects addition/deletion
  const handleAddProject = () => {
    if (!tempProject.title.trim() || !tempProject.description.trim()) {
      setErrors(prev => ({ ...prev, projectTemp: 'Both title and description are required to add a project.' }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { ...tempProject }]
    }));
    
    setTempProject({ title: '', description: '' });
    setErrors(prev => ({ ...prev, projectTemp: '', projects: '' }));
  };

  const handleRemoveProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Step 4: Resume File Upload handler
  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please upload a PDF file only.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append('resume', file);

    try {
      const response = await uploadResume(uploadData);
      if (response.data && response.data.success) {
        setFormData(prev => ({
          ...prev,
          resumeUrl: response.data.data.resumeUrl,
          resumeFileName: file.name
        }));
        setErrors(prev => ({ ...prev, resumeUrl: '' }));
      } else {
        setUploadError('Failed to upload resume. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setUploadError('Upload failed. Using prototype fallback.');
      // Prototype Fallback
      setFormData(prev => ({
        ...prev,
        resumeUrl: 'mock_resume_url.pdf',
        resumeFileName: file.name
      }));
      setErrors(prev => ({ ...prev, resumeUrl: '' }));
    } finally {
      setIsUploading(false);
    }
  };

  // Step 5: Certifications handler
  const handleAddCertification = () => {
    if (!tempCert.name.trim() || !tempCert.issuingOrg.trim() || !tempCert.date) {
      setErrors(prev => ({ ...prev, certTemp: 'Certificate name, organization and date completed are required.' }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { ...tempCert }]
    }));

    setTempCert({ name: '', issuingOrg: '', date: '' });
    setErrors(prev => ({ ...prev, certTemp: '', certifications: '' }));
  };

  const handleRemoveCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  // Validate step data
  const validateStep = (step) => {
    const stepErrors = {};
    
    if (step === 1) {
      if (!formData.name.trim()) stepErrors.name = 'Name is required';
      if (!formData.age || Number(formData.age) <= 0) stepErrors.age = 'Valid age is required';
      if (!formData.college.trim()) stepErrors.college = 'College is required';
      if (!formData.department.trim()) stepErrors.department = 'Department is required';
      if (!formData.degree.trim()) stepErrors.degree = 'Degree is required';
      if (!formData.currentYear || Number(formData.currentYear) <= 0) stepErrors.currentYear = 'Current Year is required';
      if (!formData.currentSemester || Number(formData.currentSemester) <= 0) stepErrors.currentSemester = 'Current Semester is required';
      if (!formData.cgpa || Number(formData.cgpa) < 0 || Number(formData.cgpa) > 10) {
        stepErrors.cgpa = 'CGPA must be between 0 and 10';
      }
    }
    
    if (step === 2) {
      if (formData.skills.length === 0) {
        stepErrors.skills = 'Please select at least one skill to proceed.';
      }
    }
    
    if (step === 3) {
      // Projects are optional but let's check if they started writing but forgot to add
      if (tempProject.title.trim() || tempProject.description.trim()) {
        stepErrors.projectTemp = 'Click the Add Project (+) button to save the project you are typing.';
      }
    }
    
    if (step === 4) {
      if (!formData.resumeUrl) {
        stepErrors.resumeUrl = 'Please upload your resume (PDF) to continue.';
      }
    }
    
    if (step === 5) {
      if (formData.hasCertifications && formData.certifications.length === 0 && !tempCert.name.trim()) {
        stepErrors.certifications = 'Please add at least one certification or toggle certifications off.';
      }
    }
    
    if (step === 6) {
      if (!formData.dreamJob) stepErrors.dreamJob = 'Please select your dream job role.';
      if (!formData.dreamCompany) stepErrors.dreamCompany = 'Please select your dream company.';
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    // Special UX alignment: if they typed a certification or project and clicked Continue without clicking Plus, add it automatically
    if (currentStep === 5 && formData.hasCertifications && tempCert.name.trim() && tempCert.issuingOrg.trim() && tempCert.date) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, { ...tempCert }]
      }));
      setTempCert({ name: '', issuingOrg: '', date: '' });
      setErrors(prev => ({ ...prev, certTemp: '', certifications: '' }));
      // Proceed after state update (using timeout to avoid state batching delay check)
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 50);
      return;
    }

    if (currentStep === 3 && (tempProject.title.trim() || tempProject.description.trim())) {
      if (tempProject.title.trim() && tempProject.description.trim()) {
        setFormData(prev => ({
          ...prev,
          projects: [...prev.projects, { ...tempProject }]
        }));
        setTempProject({ title: '', description: '' });
        setErrors(prev => ({ ...prev, projectTemp: '', projects: '' }));
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 50);
        return;
      }
    }

    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    
    // Construct final payload matching the database schema
    const payload = {
      name: formData.name,
      age: Number(formData.age),
      college: formData.college,
      department: formData.department,
      degree: formData.degree,
      currentYear: Number(formData.currentYear),
      currentSemester: Number(formData.currentSemester),
      cgpa: Number(formData.cgpa),
      skills: formData.skills,
      projects: formData.projects,
      certifications: formData.hasCertifications ? formData.certifications : [],
      resumeUrl: formData.resumeUrl,
      dreamJob: formData.dreamJob,
      dreamCompany: formData.dreamCompany,
      isProfileComplete: true
    };

    setIsAnalyzing(true);

    try {
      // 1. Submit Profile to Backend via POST /api/users/profile
      const response = await saveUserProfile(payload);
      
      if (response.data && response.data.success) {
        // Update user context data with the updated profile
        const updatedUser = response.data.data;
        setUser(updatedUser);
        localStorage.setItem('auth', JSON.stringify({ user: updatedUser }));
      }
      
      // 2. Animate progress bar for 4 seconds, then redirect to dashboard
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/dashboard');
      }, 4000);
      
    } catch (err) {
      console.error('Onboarding profile update failed:', err);
      // Fallback for visual testing
      setTimeout(() => {
        setIsAnalyzing(false);
        navigate('/dashboard');
      }, 4000);
    }
  };

  // Get icons for steps
  const getStepIcon = (stepNum) => {
    switch(stepNum) {
      case 1: return <User size={20} />;
      case 2: return <Code size={20} />;
      case 3: return <Brain size={20} />;
      case 4: return <FileText size={20} />;
      case 5: return <Award size={20} />;
      case 6: return <Briefcase size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  // Step Title Strings
  const stepTitles = [
    'Basic Information',
    'Skill Profile',
    'Academic Projects',
    'Resume Submission',
    'Professional Certifications',
    'Career Target'
  ];

  return (
    <div className="onboarding-container">
      {isAnalyzing && (
        <div className="analysis-overlay">
          <div className="analysis-spinner-box">
            {/* JFinder AI logo at top */}
            <div className="analysis-logo">JFinder AI</div>
            <div className="analysis-icon-container">
              <Brain size={48} className="text-primary" style={{ color: 'var(--accent-secondary)' }} />
            </div>
            {/* Cycle animated text */}
            <div className="analysis-text">{loadingTexts[loadingTextIndex]}</div>
            <div className="analysis-subtext">AI is running career alignment calculations</div>
            <div className="analysis-progress-bar-bg">
              <div className="analysis-progress-bar-fill"></div>
            </div>
          </div>
        </div>
      )}

      <div className="onboarding-card">
        {/* Progress Bar Indicator */}
        <div className="progress-container">
          <div className="progress-header">
            <div className="progress-step-title flex items-center gap-2">
              {getStepIcon(currentStep)}
              <span>{stepTitles[currentStep - 1]}</span>
            </div>
            <div className="progress-step-text">Step {currentStep} of 6</div>
          </div>
          <div className="progress-bar-bg">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Contents */}
        <div className="step-content">
          
          {/* STEP 1: BASIC INFO */}
          {currentStep === 1 && (
            <div className="step-fade">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  placeholder="e.g. Fayzul Karim" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input 
                    type="number" 
                    name="age" 
                    className="form-input" 
                    placeholder="e.g. 21" 
                    value={formData.age} 
                    onChange={handleInputChange} 
                  />
                  {errors.age && <span className="form-error">{errors.age}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Degree</label>
                  <input 
                    type="text" 
                    name="degree" 
                    className="form-input" 
                    placeholder="e.g. B.Tech / B.E." 
                    value={formData.degree} 
                    onChange={handleInputChange} 
                  />
                  {errors.degree && <span className="form-error">{errors.degree}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input 
                    type="text" 
                    name="college" 
                    className="form-input" 
                    placeholder="e.g. VIT University" 
                    value={formData.college} 
                    onChange={handleInputChange} 
                  />
                  {errors.college && <span className="form-error">{errors.college}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Department / Branch</label>
                  <input 
                    type="text" 
                    name="department" 
                    className="form-input" 
                    placeholder="e.g. Computer Science" 
                    value={formData.department} 
                    onChange={handleInputChange} 
                  />
                  {errors.department && <span className="form-error">{errors.department}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Current Academic Year</label>
                  <select 
                    name="currentYear" 
                    className="form-select" 
                    value={formData.currentYear} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                  {errors.currentYear && <span className="form-error">{errors.currentYear}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Current Semester</label>
                  <select 
                    name="currentSemester" 
                    className="form-select" 
                    value={formData.currentSemester} 
                    onChange={handleInputChange}
                  >
                    <option value="">Select Semester</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>Semester {i + 1}</option>
                    ))}
                  </select>
                  {errors.currentSemester && <span className="form-error">{errors.currentSemester}</span>}
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: '50%' }}>
                <label className="form-label">CGPA</label>
                <input 
                  type="number" 
                  name="cgpa" 
                  step="0.01" 
                  className="form-input" 
                  placeholder="e.g. 8.75" 
                  value={formData.cgpa} 
                  onChange={handleInputChange} 
                />
                {errors.cgpa && <span className="form-error">{errors.cgpa}</span>}
              </div>
            </div>
          )}

          {/* STEP 2: SKILLS MULTISELECT */}
          {currentStep === 2 && (
            <div className="step-fade">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
                Select the skill domains you have experience in. You can select multiple.
              </p>
              
              <div className="skills-grid">
                {skillOptions.map((skill) => {
                  const isActive = formData.skills.includes(skill);
                  return (
                    <div 
                      key={skill} 
                      className={`skill-tag-card ${isActive ? 'active' : ''}`}
                      onClick={() => handleSkillToggle(skill)}
                    >
                      <div className="skill-tag-name">{skill}</div>
                    </div>
                  );
                })}
              </div>
              
              {errors.skills && (
                <div className="flex items-center gap-2" style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '1rem' }}>
                  <ShieldAlert size={16} />
                  <span>{errors.skills}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PROJECTS */}
          {currentStep === 3 && (
            <div className="step-fade">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
                Add projects you've worked on. Showing academic or personal projects helps map your skills. (Optional)
              </p>

              {/* Project Input Form */}
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Project Title</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. AI-powered Resume Parser" 
                    value={tempProject.title}
                    onChange={(e) => setTempProject(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description</label>
                  <textarea 
                    rows="3" 
                    className="form-textarea" 
                    placeholder="Briefly describe what you built, technologies used, and your contribution." 
                    value={tempProject.description}
                    onChange={(e) => setTempProject(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {errors.projectTemp && <span className="form-error" style={{ display: 'block', marginBottom: '0.75rem', textAlign: 'left' }}>{errors.projectTemp}</span>}

                <Button 
                  type="button" 
                  variant="ghost" 
                  style={{ width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-secondary)' }}
                  onClick={handleAddProject}
                >
                  <Plus size={16} style={{ marginRight: '8px' }} />
                  Add Project to Profile
                </Button>
              </div>

              {/* Added Projects List */}
              {formData.projects.length > 0 && (
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>Added Projects</h4>
                  <div className="added-items-list">
                    {formData.projects.map((proj, idx) => (
                      <div key={idx} className="added-item-card">
                        <div className="added-item-info">
                          <span className="added-item-title">{proj.title}</span>
                          <span className="added-item-desc">{proj.description}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveProject(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: RESUME UPLOAD */}
          {currentStep === 4 && (
            <div className="step-fade">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
                Please upload your resume in PDF format. Our AI engine parses it for skill gap modeling.
              </p>

              <div 
                className="file-upload-box"
                onClick={() => document.getElementById('resume-file-input').click()}
              >
                <input 
                  type="file" 
                  id="resume-file-input" 
                  accept=".pdf" 
                  style={{ display: 'none' }} 
                  onChange={handleResumeChange}
                />
                <Upload size={36} className="file-upload-icon" style={{ margin: '0 auto 12px' }} />
                <div className="file-upload-text">
                  {isUploading ? 'Uploading file...' : 'Click to select and upload your resume'}
                </div>
                <div className="file-upload-info">Supported format: PDF only. Max size: 5MB</div>
              </div>

              {uploadError && <span className="form-error" style={{ display: 'block', marginTop: '0.5rem' }}>{uploadError}</span>}
              {errors.resumeUrl && <span className="form-error" style={{ display: 'block', marginTop: '0.5rem' }}>{errors.resumeUrl}</span>}

              {formData.resumeFileName && (
                <div className="file-uploaded-display">
                  <div className="flex items-center gap-2">
                    <FileText size={18} style={{ color: 'var(--success)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{formData.resumeFileName}</span>
                  </div>
                  <Badge variant="success">Uploaded Successfully</Badge>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CERTIFICATIONS */}
          {currentStep === 5 && (
            <div className="step-fade">
              <div className="cert-toggle-question">
                <p className="form-label" style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Do you have any certifications or achievements?
                </p>
                <div className="flex gap-4" style={{ marginBottom: '1.5rem' }}>
                  <button 
                    type="button" 
                    className={`toggle-btn ${formData.hasCertifications ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasCertifications: true }))}
                  >
                    Yes, I do
                  </button>
                  <button 
                    type="button" 
                    className={`toggle-btn ${!formData.hasCertifications ? 'active' : ''}`}
                    onClick={() => setFormData(prev => ({ ...prev, hasCertifications: false, certifications: [] }))}
                  >
                    No, I don't
                  </button>
                </div>
              </div>

              {formData.hasCertifications && (
                <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Certificate Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. AWS Certified Cloud Practitioner" 
                      value={tempCert.name}
                      onChange={(e) => setTempCert(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Issuing Organization</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        placeholder="e.g. Amazon Web Services" 
                        value={tempCert.issuingOrg}
                        onChange={(e) => setTempCert(prev => ({ ...prev, issuingOrg: e.target.value }))}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date Completed</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={tempCert.date}
                        onChange={(e) => setTempCert(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '0.5rem' }}>
                    <label className="form-label">Certificate File Upload (Optional)</label>
                    <input 
                      type="file" 
                      accept=".pdf,image/*" 
                      className="form-input"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setTempCert(prev => ({ ...prev, fileUrl: 'mock_cert_url.pdf' }));
                        }
                      }}
                    />
                  </div>

                  {errors.certTemp && <span className="form-error" style={{ display: 'block', marginBottom: '0.75rem', textAlign: 'left' }}>{errors.certTemp}</span>}

                  <Button 
                    type="button" 
                    variant="ghost" 
                    style={{ width: '100%', borderColor: 'var(--accent-primary)', color: 'var(--accent-secondary)', marginTop: '1rem' }}
                    onClick={handleAddCertification}
                  >
                    <Plus size={16} style={{ marginRight: '8px' }} />
                    Add Certification to List
                  </Button>
                </div>
              )}

              {errors.certifications && (
                <span className="form-error" style={{ display: 'block', marginBottom: '1rem', textAlign: 'left' }}>{errors.certifications}</span>
              )}

              {/* Added Certifications List */}
              {formData.certifications.length > 0 && (
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ marginBottom: '0.75rem' }}>Added Certifications</h4>
                  <div className="added-items-list">
                    {formData.certifications.map((cert, idx) => (
                      <div key={idx} className="added-item-card">
                        <div className="added-item-info">
                          <span className="added-item-title">{cert.name}</span>
                          <span className="added-item-desc">{cert.issuingOrg} | Completed: {cert.date}</span>
                        </div>
                        <button 
                          onClick={() => handleRemoveCertification(idx)}
                          style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skip for now option */}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  className="skip-link"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, hasCertifications: false, certifications: [] }));
                    setCurrentStep(6);
                  }}
                >
                  Skip for now
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: CAREER GOALS */}
          {currentStep === 6 && (
            <div className="step-fade">
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'left' }}>
                Select your dream career targets. Both fields are required before continuing.
              </p>

              <div className="form-group">
                <label className="form-label flex items-center gap-2">
                  <Brain size={16} style={{ color: 'var(--accent-secondary)' }} />
                  <span>Dream Job Role</span>
                </label>
                <select 
                  name="dreamJob" 
                  className="form-select" 
                  value={formData.dreamJob} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Dream Role</option>
                  {jobRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {errors.dreamJob && <span className="form-error">{errors.dreamJob}</span>}
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label className="form-label flex items-center gap-2">
                  <Building size={16} style={{ color: 'var(--accent-secondary)' }} />
                  <span>Dream Target Company</span>
                </label>
                <select 
                  name="dreamCompany" 
                  className="form-select" 
                  value={formData.dreamCompany} 
                  onChange={handleInputChange}
                >
                  <option value="">Select Dream Company</option>
                  {companies.map((company) => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
                {errors.dreamCompany && <span className="form-error">{errors.dreamCompany}</span>}
              </div>
            </div>
          )}

        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          {currentStep > 1 ? (
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </Button>
          ) : (
            <div></div> // Placeholder for spacing
          )}

          {currentStep < 6 ? (
            <Button 
              variant="primary" 
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              className="flex items-center gap-2"
              style={{ background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-highlight) 100%)', border: 'none' }}
            >
              <Sparkles size={16} />
              <span>Complete Profile</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
