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
exports.getAllResources = exports.deleteResource = exports.singleResource = exports.updateResource = exports.createResource = exports.getpermalinkFromTitle = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const Resource_model_1 = __importDefault(require("../models/Resource.model"));
const error_util_1 = require("../utils/error.util");
const upload_util_1 = require("../utils/upload.util");
const NAMESPACE = 'Resources Controller';
const ALLOWED_EXTENSIONS = /pdf|doc|docx/;
// Get Permalink
const getpermalinkFromTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    try {
        if (!req.body.title) {
            return res.status(400).json((0, error_util_1.formatError)('Invalid Title'));
        }
        let permalink = title.toLowerCase().trim().split(' ').join('-');
        const permalinks = yield Resource_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
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
// Create Event
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, tag, additionalTags, url, permalink, publish } = req.body;
        const user = req.body.api_user;
        const newResource = new Resource_model_1.default({ name, description, tag, additionalTags: JSON.parse(additionalTags), url, permalink, publish });
        const permalinks = yield Resource_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
        if (permalinks.length > 0) {
            newResource.permalink = `${newResource.permalink}-${permalinks.length}`;
        }
        newResource.user = user._id;
        if (req.files) {
            const image = req.files.image;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only doc, docx and pdf files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, image.name);
            if (imageUrl === 'fail') {
                return res.json({ success: false });
            }
            newResource.image = imageUrl;
        }
        yield newResource.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create resource error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createResource = createResource;
// Update Event
const updateResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resourceId, name, description, tag, additionalTags, url, permalink, publish } = req.body;
    const user = req.body.api_user;
    try {
        const resourceFound = yield Resource_model_1.default.findById(resourceId);
        if (!resourceFound) {
            return res.status(404).json((0, error_util_1.formatError)('Resource not found'));
        }
        const to_update = {
            name,
            description,
            tag,
            additionalTags: JSON.parse(additionalTags),
            url,
            permalink,
            publish,
        };
        if (req.files) {
            const image = req.files.image;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only Image files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, image.name);
            if (imageUrl === 'fail') {
                return res.json({ success: false });
            }
            to_update.image = imageUrl;
        }
        yield Resource_model_1.default.findByIdAndUpdate(resourceId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Update resource error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateResource = updateResource;
// View Single Event
const singleResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resourceFound = yield Resource_model_1.default.findById(id);
        if (!resourceFound) {
            return res.status(404).json((0, error_util_1.formatError)('No resources found'));
        }
        res.json(resourceFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single resource error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.singleResource = singleResource;
// View Single Event
const deleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const resourceFound = yield Resource_model_1.default.findById(id);
        if (!resourceFound) {
            return res.status(404).json((0, error_util_1.formatError)('No resources found'));
        }
        yield Resource_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'success' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single resource error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteResource = deleteResource;
// Get All Events
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        if (published === 'true') {
            const today = new Date().toISOString();
            const resources = yield Resource_model_1.default.find({ publish: true }).sort({ date: 'asc' });
            return res.json(resources);
        }
        else {
            const resources = yield Resource_model_1.default.find({}).sort({ date: 'asc' });
            return res.json(resources);
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View all resources error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getAllResources = getAllResources;
