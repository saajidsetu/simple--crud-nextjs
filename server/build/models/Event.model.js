"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const EventSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
    },
    date: {
        type: Date,
        required: true,
    },
    timezone: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: true,
    },
    registrationLink: {
        type: String,
        required: true,
    },
    permalink: {
        type: String,
        required: true,
        unique: true,
    },
    publish: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Event = (0, mongoose_1.model)('events', EventSchema);
exports.default = Event;
