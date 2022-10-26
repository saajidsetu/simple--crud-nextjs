"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webinars_controller_1 = require("../controllers/webinars.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const webinar_validator_1 = require("../validators/webinar.validator");
const router = (0, express_1.Router)();
router.patch('/update', webinar_validator_1.updateWebinarSchema, error_validation_1.default, access_control_middleware_1.verifyToken, webinars_controller_1.updateWebinar);
router.post('/create', webinar_validator_1.createWebinarSchema, error_validation_1.default, access_control_middleware_1.verifyToken, webinars_controller_1.createWebinar);
router.post('/get-permalink', webinars_controller_1.getpermalinkFromTitle);
router.get('/', webinars_controller_1.getAllWebinars);
router.get('/:id', webinars_controller_1.singleWebinar);
router.delete('/:id', access_control_middleware_1.verifyToken, webinars_controller_1.deleteWebinar);
exports.default = router;
