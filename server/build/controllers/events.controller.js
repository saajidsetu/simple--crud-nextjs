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
exports.getAllEvents = exports.deleteEvent = exports.singleEvent = exports.updateEvent = exports.createEvent = exports.getpermalinkFromTitle = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const Event_model_1 = __importDefault(require("../models/Event.model"));
const error_util_1 = require("../utils/error.util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const misc_util_1 = require("../utils/misc.util");
const upload_util_1 = require("../utils/upload.util");
const NAMESPACE = 'Events Controller';
const ALLOWED_EXTENSIONS = /png|jpg|jpeg|webp/;
// Get Permalink
const getpermalinkFromTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    try {
        if (!req.body.title) {
            return res.status(400).json((0, error_util_1.formatError)('Invalid Title'));
        }
        let permalink = (0, misc_util_1.genSlug)(title);
        const permalinks = yield Event_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
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
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, date, timezone, location, registrationLink, permalink, publish } = req.body;
        const user = req.body.api_user;
        const newEvent = new Event_model_1.default({ name, description, timezone, location, registrationLink, permalink, publish });
        const permalinks = yield Event_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
        if (permalinks.length > 0) {
            newEvent.permalink = `${newEvent.permalink}-${permalinks.length}`;
        }
        newEvent.date = new Date(date);
        newEvent.user = user._id;
        if (req.files) {
            const image = req.files.image;
            //const { imageName } = req.body;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only Image files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            // Will be removed after the CDN is introduced.
            // const user: iApiUser = req.body.api_user;
            // await fs.mkdir(path.resolve('server', 'uploads', user._id),{recursive:true});
            // const url = `${path.resolve('server', 'uploads', user._id)}/${unique_number}-${image.name}`;
            // await promisify(image.mv)(url);
            // const imageUrl = `${server}/uploads/${user._id}/${unique_number}-${image.name}`;
            const imageUrl = yield (0, upload_util_1.uploadFileToCDN)(image, image.name);
            if (imageUrl === 'fail') {
                return res.json({ success: false });
            }
            newEvent.image = imageUrl;
        }
        yield newEvent.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create event error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createEvent = createEvent;
// Update Event
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { eventId, name, description, date, timezone, location, registrationLink, permalink, publish } = req.body;
    try {
        const eventFound = yield Event_model_1.default.findById(eventId);
        if (!eventFound) {
            return res.status(404).json((0, error_util_1.formatError)('Event not found'));
        }
        const to_update = {
            name,
            description,
            date,
            timezone,
            location,
            registrationLink,
            permalink,
            publish,
        };
        if (req.files) {
            const image = req.files.image;
            //const { imageName } = req.body;
            const extName = image.name.split('.')[image.name.split('.').length - 1];
            if (!ALLOWED_EXTENSIONS.test(extName)) {
                return res.status(400).json((0, error_util_1.formatError)('Only Image files are acceptable'));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            // const url = `${path.resolve('server', 'uploads')}/${unique_number}-${image.name}`;
            // await promisify(image.mv)(url);
            // const imageUrl = `${server}/uploads/${unique_number}-${image.name}`;
            const user = req.body.api_user;
            yield promises_1.default.mkdir(path_1.default.resolve('server', 'uploads', user._id), { recursive: true });
            const url = `${path_1.default.resolve('server', 'uploads', user._id)}/${unique_number}-${image.name}`;
            yield (0, util_1.promisify)(image.mv)(url);
            const imageUrl = `${server}/uploads/${user._id}/${unique_number}-${image.name}`;
            to_update.image = imageUrl;
        }
        yield Event_model_1.default.findByIdAndUpdate(eventId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Update event error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateEvent = updateEvent;
// View Single Event
const singleEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const eventFound = yield Event_model_1.default.findById(id);
        if (!eventFound) {
            return res.status(404).json((0, error_util_1.formatError)('No events found'));
        }
        res.json(eventFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single event error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.singleEvent = singleEvent;
// View Single Event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const eventFound = yield Event_model_1.default.findById(id);
        if (!eventFound) {
            return res.status(404).json((0, error_util_1.formatError)('No events found'));
        }
        yield Event_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'success' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single event error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteEvent = deleteEvent;
// Get All Events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        if (published === 'true') {
            const today = new Date().toISOString();
            const events = yield Event_model_1.default.find({ publish: true }).sort({ date: 'asc' });
            return res.json(events);
        }
        else {
            const events = yield Event_model_1.default.find({}).sort({ date: 'asc' });
            return res.json(events);
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View all events error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getAllEvents = getAllEvents;
