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
exports.getAllWebinars = exports.deleteWebinar = exports.singleWebinar = exports.updateWebinar = exports.createWebinar = exports.getpermalinkFromTitle = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const error_util_1 = require("../utils/error.util");
const Webinar_model_1 = __importDefault(require("../models/Webinar.model"));
const misc_util_1 = require("../utils/misc.util");
const upload_util_1 = require("../utils/upload.util");
const NAMESPACE = 'Webinars Controller';
const ALLOWED_EXTENSIONS = /|mp4|avi|webm/;
// Get Permalink
const getpermalinkFromTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    try {
        if (!req.body.title) {
            return res.status(400).json((0, error_util_1.formatError)('Invalid Title'));
        }
        let permalink = (0, misc_util_1.genSlug)(title);
        const permalinks = yield Webinar_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
        if (permalinks.length > 0) {
            permalink = `${permalink}-${permalinks.length}`;
        }
        res.json({ permalink });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Permalink generation error', err);
        res.status(500).json((0, error_util_1.formatError)('Server Error'));
    }
});
exports.getpermalinkFromTitle = getpermalinkFromTitle;
// Create Webinar
const createWebinar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, videolink, permalink, publish } = req.body;
        const user = req.body.api_user;
        if (!req.files && videolink === '') {
            return res.status(400).json((0, error_util_1.formatError)('Must provide video or link'));
        }
        const newWebinar = new Webinar_model_1.default({ name, description, videolink, permalink, publish });
        const permalinks = yield Webinar_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
        if (permalinks.length > 0) {
            newWebinar.permalink = `${newWebinar.permalink}-${permalinks.length}`;
        }
        newWebinar.user = user._id;
        if (req.files) {
            const image = req.files.image;
            //const { imageName } = req.body;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only Video files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            // const url = `${path.resolve('server', 'uploads')}/${unique_number}-${image.name}`;
            // await promisify(image.mv)(url);
            // const imageUrl = `${server}/uploads/${unique_number}-${image.name}`;
            const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, image.name);
            if (imageUrl === 'fail') {
                return res.json({ success: false });
            }
            newWebinar.image = imageUrl;
        }
        yield newWebinar.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create webinar error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createWebinar = createWebinar;
// Update Webinar
const updateWebinar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { webinarId, name, description, videolink, permalink, publish } = req.body;
    try {
        const webinarFound = yield Webinar_model_1.default.findById(webinarId);
        if (!webinarFound) {
            return res.status(404).json((0, error_util_1.formatError)('Webinar not found'));
        }
        const to_update = {
            name,
            description,
            videolink,
            permalink,
            publish,
        };
        // if (req.files) {
        //     logger.info(NAMESPACE, 'Update -> check for files');
        // }
        if (videolink.length > 0) {
            to_update.image = '';
        }
        if (req.files && videolink.length === 0) {
            const image = req.files.image;
            //const { imageName } = req.body;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only Video files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            // const user: iApiUser = req.body.api_user;
            // await fs.mkdir(path.resolve('server', 'uploads', user._id), { recursive: true });
            // const url = `${path.resolve('server', 'uploads', user._id)}/${unique_number}-${image.name}`;
            // await promisify(image.mv)(url);
            // const imageUrl = `${server}/uploads/${user._id}/${unique_number}-${image.name}`;
            const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, image.name);
            if (imageUrl === 'fail') {
                return res.json({ success: false });
            }
            to_update.image = imageUrl;
            to_update.videolink = '';
        }
        yield Webinar_model_1.default.findByIdAndUpdate(webinarId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Update webinar error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateWebinar = updateWebinar;
// View Single Webinar
const singleWebinar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const webinarFound = yield Webinar_model_1.default.findById(id);
        if (!webinarFound) {
            return res.status(404).json((0, error_util_1.formatError)('No webinar found'));
        }
        res.json(webinarFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single webinar error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.singleWebinar = singleWebinar;
// Delete Webinar
const deleteWebinar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const webinarFound = yield Webinar_model_1.default.findById(id);
        if (!webinarFound) {
            return res.status(404).json((0, error_util_1.formatError)('No webinars found'));
        }
        yield Webinar_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'success' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single webinar error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteWebinar = deleteWebinar;
// Get All Webinars
const getAllWebinars = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        if (published === 'true') {
            const webinars = (yield Webinar_model_1.default.find({ publish: true })).reverse();
            return res.json(webinars);
        }
        else {
            const webinars = (yield Webinar_model_1.default.find({})).reverse();
            return res.json(webinars);
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View all webinars error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getAllWebinars = getAllWebinars;
