"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profiles_controller_1 = require("../controllers/profiles.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
// import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator'
const router = (0, express_1.Router)();
router.patch('/', error_validation_1.default, access_control_middleware_1.verifyToken, profiles_controller_1.updateProfile);
router.post('/', error_validation_1.default, access_control_middleware_1.verifyToken, profiles_controller_1.createProfile);
router.get('/', profiles_controller_1.getProfileList);
router.get('/by-user/:userId', access_control_middleware_1.verifyToken, profiles_controller_1.getProfileByUser);
router.get('/:id', profiles_controller_1.getSingleProfile);
router.delete('/:id', access_control_middleware_1.verifyToken, profiles_controller_1.deleteProfile);
exports.default = router;
