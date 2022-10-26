"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const events_controller_1 = require("../controllers/events.controller");
const access_control_middleware_1 = require("../middlewares/access-control.middleware");
const error_validation_1 = __importDefault(require("../middlewares/error.validation"));
const event_validator_1 = require("../validators/event.validator");
const router = (0, express_1.Router)();
router.patch('/update', event_validator_1.updateEventSchema, error_validation_1.default, access_control_middleware_1.verifyToken, events_controller_1.updateEvent);
router.post('/create', event_validator_1.createEventSchema, error_validation_1.default, access_control_middleware_1.verifyToken, events_controller_1.createEvent);
router.post('/get-permalink', events_controller_1.getpermalinkFromTitle);
router.get('/', events_controller_1.getAllEvents);
router.get('/:id', events_controller_1.singleEvent);
router.delete('/:id', access_control_middleware_1.verifyToken, events_controller_1.deleteEvent);
exports.default = router;
