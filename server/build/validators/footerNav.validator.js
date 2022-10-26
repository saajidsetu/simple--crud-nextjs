"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFooterNavSchema = exports.createFooterNavSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createFooterNavSchema = [
    (0, express_validator_1.body)('address', 'Address is required').isString(),
    (0, express_validator_1.body)('tel', 'Tel is required').isString(),
    (0, express_validator_1.body)('hour', 'Office Hours is required').isString(),
    (0, express_validator_1.body)('fbLink', 'Facebook link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('igLink', 'Instagram link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('twLink', 'Twitter link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('ytLink', 'Youtube link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('aboutusLink', 'About us link Must be a valid url').isString().optional(),
    (0, express_validator_1.body)('contactLink', 'Contact us link Must be a valid url').isString().optional(),
];
exports.updateFooterNavSchema = [
    (0, express_validator_1.body)('address', 'Address is required').isString().optional(),
    (0, express_validator_1.body)('tel', 'Tel is required').isString().optional(),
    (0, express_validator_1.body)('hour', 'Office Hours is required').isString().optional(),
    (0, express_validator_1.body)('fbLink', 'Facebook link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('igLink', 'Instagram link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('twLink', 'Twitter link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('ytLink', 'Youtube link Must be a valid url').isString().isURL().optional(),
    (0, express_validator_1.body)('aboutusLink', 'About us link Must be a valid url').isString().optional(),
    (0, express_validator_1.body)('contactLink', 'Contact us link Must be a valid url').isString().optional(),
];
