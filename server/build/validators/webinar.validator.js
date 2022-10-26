"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateWebinarSchema = exports.createWebinarSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createWebinarSchema = [
    (0, express_validator_1.body)('name', 'Webinar name is required').isString(),
    (0, express_validator_1.body)('description', 'Webinar description is required').isString().optional(),
    (0, express_validator_1.body)('videolink', 'Webinar videolink is required').isString().optional(),
    (0, express_validator_1.body)('permalink', 'Webinar permalink is required').isString(),
    (0, express_validator_1.body)('publish', 'Webinar publishing decision is required').isBoolean({ loose: true }),
];
exports.updateWebinarSchema = [
    (0, express_validator_1.body)('webinarId', 'Webinar ID is required').isString(),
    (0, express_validator_1.body)('name', 'Webinar name is required').isString().optional(),
    (0, express_validator_1.body)('description', 'Webinar description is required').isString().optional(),
    (0, express_validator_1.body)('videolink', 'Webinar videolink is required').isString().optional(),
    (0, express_validator_1.body)('permalink', 'Event permalink is required').isString().optional(),
    (0, express_validator_1.body)('publish', 'Event publishing decision is required').isBoolean({ loose: true }).optional(),
];
