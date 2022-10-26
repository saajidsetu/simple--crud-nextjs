"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResourceSchema = new mongoose_1.Schema({
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
    tag: {
        type: String,
        required: true
    },
    additionalTags: {
        type: [String],
        default: [],
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    url: {
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
const Resource = (0, mongoose_1.model)('resources', ResourceSchema);
exports.default = Resource;
