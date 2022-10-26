"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEventSchema = exports.createEventSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createEventSchema = [
    (0, express_validator_1.body)('name', 'Event name is required').isString(),
    (0, express_validator_1.body)('description', 'Event description is required').isString(),
    (0, express_validator_1.body)('date', 'Event date is required').isString(),
    (0, express_validator_1.body)('timezone', 'Event timezone is required').isString(),
    (0, express_validator_1.body)('location', 'Event location is required').isString(),
    (0, express_validator_1.body)('registrationLink', 'Event registrationLink is required').isURL(),
    (0, express_validator_1.body)('permalink', 'Event permalink is required').isString(),
    (0, express_validator_1.body)('publish', 'Event publishing decision is required').isBoolean({ loose: true }),
];
exports.updateEventSchema = [
    (0, express_validator_1.body)('eventId', 'Event ID is required').isString(),
    (0, express_validator_1.body)('name', 'Event name is required').isString().optional(),
    (0, express_validator_1.body)('description', 'Event description is required').isString().optional(),
    (0, express_validator_1.body)('date', 'Event date is required').isString().optional(),
    (0, express_validator_1.body)('timezone', 'Event timezone is required').isString().optional(),
    (0, express_validator_1.body)('location', 'Event location is required').isString().optional(),
    (0, express_validator_1.body)('registrationLink', 'Event registrationLink is required').isURL().optional(),
    (0, express_validator_1.body)('permalink', 'Event permalink is required').isString().optional(),
    (0, express_validator_1.body)('publish', 'Event publishing decision is required').isBoolean({ loose: true }).optional(),
];
