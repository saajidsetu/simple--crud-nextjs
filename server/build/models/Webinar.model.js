"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WebinarSchema = new mongoose_1.Schema({
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
    },
    image: {
        type: String,
    },
    videolink: {
        type: String,
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
const Webinar = (0, mongoose_1.model)('webinars', WebinarSchema);
exports.default = Webinar;
