"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateJobPostingSchema = exports.createJobPostingSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createJobPostingSchema = [
    (0, express_validator_1.body)('title', 'Title is required').isString(),
    (0, express_validator_1.body)('employer', 'Employer is required').isString(),
    (0, express_validator_1.body)('description', 'Description is required').isString(),
    //body('helpText', 'Help text is required').isString(),
    (0, express_validator_1.body)('jobLink', 'Job link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('deadline', 'Deadline Must be a date').isString().optional(),
    (0, express_validator_1.body)('howToApply', 'How To Apply is required').isString(),
    (0, express_validator_1.body)('employerContact', 'Employer Contact is required').isString(),
];
exports.updateJobPostingSchema = [
    (0, express_validator_1.body)('jobId', 'Job ID is required').isString(),
    (0, express_validator_1.body)('title', 'Title is required').isString().optional(),
    (0, express_validator_1.body)('employer', 'Employer is required').isString().optional(),
    (0, express_validator_1.body)('description', 'Description is required').isString().optional(),
    //body('helpText', 'Help text is required').isString().optional(),
    (0, express_validator_1.body)('jobLink', 'Job link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('deadline', 'Deadline Must be a valid date').isString().optional(),
    (0, express_validator_1.body)('howToApply', 'How To Apply is required').isString().optional(),
    (0, express_validator_1.body)('employerContact', 'Employer Contact is required').isString().optional(),
];
