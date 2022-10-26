"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const JobPostingSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
        required: true,
    },
    employer: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // helpText: {
    //     type: String,
    //     required: true,
    // },
    jobLink: {
        type: String,
        default: '',
    },
    deadline: {
        type: Date,
    },
    howToApply: {
        type: String,
        required: true,
    },
    employerContact: {
        type: String,
        required: true,
    },
    publish: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const JobPosting = (0, mongoose_1.model)('job-postings', JobPostingSchema);
exports.default = JobPosting;
