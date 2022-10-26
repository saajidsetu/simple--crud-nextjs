"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FooterNavSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
    },
    address: {
        type: String,
        required: true,
    },
    tel: {
        type: String,
        required: true,
    },
    hour: {
        type: String,
        required: true,
    },
    fbLink: {
        type: String,
        default: '',
    },
    igLink: {
        type: String,
        default: '',
    },
    twLink: {
        type: String,
        default: '',
    },
    ytLink: {
        type: String,
        default: '',
    },
    aboutusLink: {
        type: String,
        required: true,
    },
    contactLink: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const FooterNav = (0, mongoose_1.model)('footer-nav', FooterNavSchema);
exports.default = FooterNav;
