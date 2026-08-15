const Company = require('../models/Company');
const Job = require('../models/Job');
const Skill = require('../models/Skill');

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(200).json({ success: true, data: [] });
    }
    const companies = await Company.find({
      $or: [
        { companyName: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } },
        { companyDescription: { $regex: q, $options: 'i' } }
      ]
    });
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    
    // Fetch jobs for this company
    const jobs = await Job.find({ companyName: company.companyName });
    
    // Fetch skills for these jobs
    let requiredSkills = [];
    if (jobs.length > 0) {
      const jobIds = jobs.map(j => j._id);
      requiredSkills = await Skill.find({ jobId: { $in: jobIds } });
    }
    
    // Similar companies based on industry
    const similarCompanies = await Company.find({ 
      industry: company.industry, 
      _id: { $ne: company._id } 
    }).limit(3);

    res.status(200).json({ 
      success: true, 
      data: { 
        company, 
        jobs, 
        requiredSkills,
        similarCompanies
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const companies = await Company.find({}).limit(5); // Mock recommendation
    res.status(200).json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSalaryTrends = async (req, res) => {
  try {
    const jobs = await Job.find({});
    
    // Group by jobRole and calculate min/max salary from strings like "6-12 LPA"
    const salaryData = {};
    
    jobs.forEach(job => {
      if (job.salaryRange && job.jobRole) {
        const match = job.salaryRange.match(/(\d+)-(\d+)/);
        if (match) {
          const min = parseInt(match[1]);
          const max = parseInt(match[2]);
          if (!salaryData[job.jobRole]) {
            salaryData[job.jobRole] = { minSum: 0, maxSum: 0, count: 0 };
          }
          salaryData[job.jobRole].minSum += min;
          salaryData[job.jobRole].maxSum += max;
          salaryData[job.jobRole].count += 1;
        }
      }
    });

    const result = Object.keys(salaryData).map(role => {
      const data = salaryData[role];
      return {
        jobRole: role,
        minSalary: Math.round(data.minSum / data.count),
        maxSalary: Math.round(data.maxSum / data.count)
      };
    });

    // If no jobs data is present for salary, mock some generic data for the chart
    if (result.length === 0) {
      result.push(
        { jobRole: 'Software Engineer', minSalary: 6, maxSalary: 15 },
        { jobRole: 'Data Analyst', minSalary: 5, maxSalary: 12 },
        { jobRole: 'Data Scientist', minSalary: 8, maxSalary: 18 },
        { jobRole: 'Product Manager', minSalary: 10, maxSalary: 25 },
        { jobRole: 'Cloud Engineer', minSalary: 7, maxSalary: 16 }
      );
    }

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCompanies,
  searchCompanies,
  getCompanyById,
  getRecommendations,
  getSalaryTrends
};
