const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Skill = require('../models/Skill');
const News = require('../models/News');
const JobTrend = require('../models/JobTrend');
const Roadmap = require('../models/Roadmap');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for Seeding');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await Company.deleteMany();
    await Job.deleteMany();
    await Skill.deleteMany();
    await News.deleteMany();
    await JobTrend.deleteMany();
    await Roadmap.deleteMany();

    const companies = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/companies.json'), 'utf-8'));
    const jobs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/jobs.json'), 'utf-8'));
    const skills = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/skills.json'), 'utf-8'));
    const news = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/news.json'), 'utf-8'));
    const trends = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/trends.json'), 'utf-8'));
    const roadmaps = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/roadmaps.json'), 'utf-8'));

    await Company.insertMany(companies);
    await Job.insertMany(jobs);
    await Skill.insertMany(skills);
    await News.insertMany(news);
    await JobTrend.insertMany(trends);
    await Roadmap.insertMany(roadmaps);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

connectDB().then(() => {
  importData();
});
