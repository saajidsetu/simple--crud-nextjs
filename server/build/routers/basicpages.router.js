"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const basicpages_controller_1 = require("../controllers/basicpages.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const basicpage_validator_1 = require("../validators/basicpage.validator");
const router = (0, express_1.Router)();
router.patch('/update', basicpage_validator_1.updateBasicpageSchema, error_validation_1.default, access_control_middleware_1.verifyToken, basicpages_controller_1.updateBasicpage);
router.post('/create', basicpage_validator_1.createBasicpageSchema, error_validation_1.default, access_control_middleware_1.verifyToken, basicpages_controller_1.createBasicpage);
router.post('/get-permalink', basicpages_controller_1.getpermalinkFromTitle);
router.get('/', basicpages_controller_1.getAllBasicpages);
router.get('/:id', basicpages_controller_1.singleBasicpage);
router.delete('/:id', access_control_middleware_1.verifyToken, basicpages_controller_1.deleteBasicpage);
exports.default = router;
