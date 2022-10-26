"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJobPosting = exports.getSingleJobPosting = exports.updateJobPosting = exports.getAllJobPostings = exports.createJobPosting = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const JobPosting_model_1 = __importDefault(require("../models/JobPosting.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const email_util_1 = require("../utils/email.util");
const error_util_1 = require("../utils/error.util");
const NAMESPACE = 'Job posting controller';
const createJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, employer, description, jobLink, deadline, howToApply, employerContact, publish } = req.body;
    try {
        const newJobPosting = new JobPosting_model_1.default({
            title,
            employer,
            description,
            jobLink,
            howToApply,
            employerContact,
            publish,
        });
        const user = req.body.api_user;
        newJobPosting.user = user._id;
        if (deadline && deadline !== '') {
            newJobPosting.deadline = new Date(deadline);
        }
        const saved = yield newJobPosting.save();
        if (saved) {
            const admins = (yield User_model_1.default.find({ role: 'admin' }).select('email')).map((item) => item.email);
            const jobUrl = `${process.env.SERVER_ADDRESS}/jobs/${saved._id}`;
            const sentMail = yield (0, email_util_1.sendEmailFromTemplate)({
                to: admins,
                subject: 'New job posting created',
                template: 'jobPosted',
                context: { jobUrl },
            });
        }
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Job posting creation error', err);
        res.status(500).json((0, error_util_1.formatError)('Job posting creation error'));
    }
});
exports.createJobPosting = createJobPosting;
const getAllJobPostings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        let allJobs;
        if (published && published === 'true') {
            allJobs = yield JobPosting_model_1.default.find({ publish: true });
        }
        else {
            allJobs = yield JobPosting_model_1.default.find();
        }
        res.json(allJobs);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Job posting fetching error', err);
        res.status(500).json((0, error_util_1.formatError)('Job posting fetching error'));
    }
});
exports.getAllJobPostings = getAllJobPostings;
const updateJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body.api_user;
        const { jobId, title, employer, description, jobLink, deadline, howToApply, employerContact, publish } = req.body;
        const jobFound = yield JobPosting_model_1.default.findById(jobId);
        if (!jobFound) {
            return res.status(404).json((0, error_util_1.formatError)('No job posting found!'));
        }
        if (user.role !== 'admin' && user._id !== jobId) {
            return res.status(401).json((0, error_util_1.formatError)('Only admin or job poster can update the job'));
        }
        const to_update = { title, employer, description, jobLink, howToApply, employerContact, publish };
        if (typeof deadline !== 'undefined' && deadline !== '') {
            //logger.info(NAMESPACE, 'Checking update method --> deadline: reached');
            to_update.deadline = new Date(deadline);
        }
        const updated = yield JobPosting_model_1.default.findByIdAndUpdate(jobId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Job posting updating error', err);
        res.status(500).json((0, error_util_1.formatError)('Job posting updating error'));
    }
});
exports.updateJobPosting = updateJobPosting;
const getSingleJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    try {
        const jobFound = yield JobPosting_model_1.default.findById(jobId);
        if (!jobFound) {
            return res.status(404).json((0, error_util_1.formatError)('No jobs found!'));
        }
        res.json(jobFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Job posting fetching error', err);
        res.status(500).json((0, error_util_1.formatError)('Job posting fetching error'));
    }
});
exports.getSingleJobPosting = getSingleJobPosting;
const deleteJobPosting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = req.params.jobId;
    const user = req.body.api_user;
    try {
        const jobFound = yield JobPosting_model_1.default.findById(jobId);
        if (!jobFound) {
            return res.status(404).json((0, error_util_1.formatError)('No jobs found!'));
        }
        if (user.role !== 'admin' && user._id !== jobId) {
            return res.status(401).json((0, error_util_1.formatError)('Only admin or job poster can delete the job'));
        }
        yield JobPosting_model_1.default.findByIdAndDelete(jobId);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Job posting fetching error', err);
        res.status(500).json((0, error_util_1.formatError)('Job posting fetching error'));
    }
});
exports.deleteJobPosting = deleteJobPosting;
