"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFooterNavs = exports.deleteFooterNav = exports.singleFooterNav = exports.updateFooterNav = exports.createFooterNav = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const error_util_1 = require("../utils/error.util");
const FooterNav_model_1 = __importDefault(require("../models/FooterNav.model"));
const NAMESPACE = 'FooterNav Controller';
// Create FooterNav
const createFooterNav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, tel, hour, fbLink, igLink, twLink, ytLink, aboutusLink, contactLink } = req.body;
        const user = req.body.api_user;
        const newFooterNav = new FooterNav_model_1.default({ address, tel, hour, fbLink, igLink, twLink, ytLink, aboutusLink, contactLink });
        newFooterNav.user = user._id;
        yield newFooterNav.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create footer error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createFooterNav = createFooterNav;
// Update FooterNav
const updateFooterNav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, tel, hour, fbLink, igLink, twLink, ytLink, aboutusLink, contactLink } = req.body;
    const footerNavId = (yield FooterNav_model_1.default.find())[0]._id;
    try {
        const footerNavFound = yield FooterNav_model_1.default.findById(footerNavId);
        if (!footerNavFound) {
            return res.status(404).json((0, error_util_1.formatError)('FooterNav not found'));
        }
        const to_update = {
            address,
            tel,
            hour,
            fbLink,
            igLink,
            twLink,
            ytLink,
            aboutusLink,
            contactLink
        };
        yield FooterNav_model_1.default.findByIdAndUpdate(footerNavId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Update footerNav error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateFooterNav = updateFooterNav;
// View Single FooterNav
const singleFooterNav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = (yield FooterNav_model_1.default.find())[0]._id;
        const footerNavFound = yield FooterNav_model_1.default.findById(id);
        if (!footerNavFound) {
            return res.status(404).json((0, error_util_1.formatError)('No footerNav found'));
        }
        res.json(footerNavFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single footerNav error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.singleFooterNav = singleFooterNav;
// Delete Single FooterNav
const deleteFooterNav = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const footerNavFound = yield FooterNav_model_1.default.findById(id);
        if (!footerNavFound) {
            return res.status(404).json((0, error_util_1.formatError)('No basicpage found'));
        }
        yield FooterNav_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'success' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single footerNav error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteFooterNav = deleteFooterNav;
// Get All FooterNavs
const getAllFooterNavs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        if (published === 'true') {
            const footerNavs = (yield FooterNav_model_1.default.find({ publish: true })).reverse();
            return res.json(footerNavs);
        }
        else {
            const footerNavs = (yield FooterNav_model_1.default.find({})).reverse();
            return res.json(footerNavs);
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View all footerNavs error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getAllFooterNavs = getAllFooterNavs;
