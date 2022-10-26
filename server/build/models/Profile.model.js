"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProfileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
    },
    profile_image: {
        type: String,
        default: "",
    },
    club_name: {
        type: String,
        default: "",
    },
    club_logo: {
        type: String,
        default: "",
    },
    nccp_number: {
        type: String,
        default: "",
    },
    club_number: {
        type: String,
        default: "",
    },
    about_us: {
        type: String,
        default: "",
    },
    offered_programms: {
        type: [String],
        default: [],
        required: false,
    },
    contact_name: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    tel: {
        type: String,
        default: "",
    },
    cell: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        default: "",
    },
    website: {
        type: String,
        default: "",
    },
    incorporation_number: {
        type: String,
        default: "",
    },
    facebook: {
        type: String,
        default: "",
    },
    twitter: {
        type: String,
        default: "",
    },
    instagram: {
        type: String,
        default: "",
    },
    youtube: {
        type: String,
        default: "",
    },
    linkedin: {
        type: String,
        default: "",
    },
    canskateexcellence: {
        type: String,
        default: "",
    },
    excellencedetails: {
        type: String,
        default: "",
    },
    coaches: {
        type: [
            {
                name: { type: String, default: "" },
                email: { type: String, default: "" },
                certificates: { type: String, default: "" },
            },
        ],
        default: [],
    },
    owners: {
        type: [
            {
                name: { type: String, default: "" },
                email: { type: String, default: "" },
                title: { type: String, default: "" },
            },
        ],
        default: [],
    },
    documents: {
        type: Array,
        default: [],
    },
}, { timestamps: true });
const Profile = (0, mongoose_1.model)("profiles", ProfileSchema);
exports.default = Profile;
