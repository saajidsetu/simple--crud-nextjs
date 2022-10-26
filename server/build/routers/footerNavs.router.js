"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const footerNav_controller_1 = require("../controllers/footerNav.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const footerNav_validator_1 = require("../validators/footerNav.validator");
const router = (0, express_1.Router)();
router.patch('/', footerNav_validator_1.updateFooterNavSchema, error_validation_1.default, access_control_middleware_1.verifyToken, footerNav_controller_1.updateFooterNav);
// router.post('/create', createFooterNavSchema, validateRequest, verifyToken, createFooterNav);
// router.get('/', getAllFooterNavs);
router.get('/', footerNav_controller_1.singleFooterNav);
// router.delete('/:id', verifyToken, deleteFooterNav);
exports.default = router;
