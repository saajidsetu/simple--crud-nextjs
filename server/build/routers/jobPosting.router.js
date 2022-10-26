"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobPosting_controller_1 = require("../controllers/jobPosting.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const jobPosting_validator_1 = require("../validators/jobPosting.validator");
const router = (0, express_1.Router)();
router.post('/', jobPosting_validator_1.createJobPostingSchema, error_validation_1.default, access_control_middleware_1.verifyToken, jobPosting_controller_1.createJobPosting);
router.patch('/', jobPosting_validator_1.updateJobPostingSchema, error_validation_1.default, access_control_middleware_1.verifyToken, jobPosting_controller_1.updateJobPosting);
router.get('/', jobPosting_controller_1.getAllJobPostings);
router.get('/:jobId', access_control_middleware_1.verifyToken, jobPosting_controller_1.getSingleJobPosting);
router.delete('/:jobId', access_control_middleware_1.verifyToken, jobPosting_controller_1.deleteJobPosting);
exports.default = router;
