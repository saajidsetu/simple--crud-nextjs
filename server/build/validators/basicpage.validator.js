"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBasicpageSchema = exports.createBasicpageSchema = void 0;
const express_validator_1 = require("express-validator");
exports.createBasicpageSchema = [
    (0, express_validator_1.body)('name', 'Basic Page name is required').isString(),
    (0, express_validator_1.body)('description', 'Basic Page description is required').isString(),
    (0, express_validator_1.body)('permalink', 'Basic Page permalink is required').isString(),
];
exports.updateBasicpageSchema = [
    (0, express_validator_1.body)('basicpageId', 'Baisc Page ID is required').isString(),
    (0, express_validator_1.body)('name', 'Basic Page name is required').isString().optional(),
    (0, express_validator_1.body)('description', 'Basic Page description is required').isString().optional(),
    (0, express_validator_1.body)('permalink', 'Basic Page permalink is required').isString().optional(),
];
