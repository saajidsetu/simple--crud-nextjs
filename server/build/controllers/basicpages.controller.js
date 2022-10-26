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
exports.getAllBasicpages = exports.deleteBasicpage = exports.singleBasicpage = exports.updateBasicpage = exports.createBasicpage = exports.getpermalinkFromTitle = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const error_util_1 = require("../utils/error.util");
const Basicpage_model_1 = __importDefault(require("../models/Basicpage.model"));
const misc_util_1 = require("../utils/misc.util");
const NAMESPACE = 'Basicpages Controller';
// // Get Permalink
// export const getpermalinkFromTitle = async (req: Request, res: Response) => {
//     const title: string = req.body.title;
//     try {
//         if (!req.body.title) {
//             return res.status(400).json(formatError('Invalid Title'));
//         }
//         let permalink = title.toLowerCase().trim().split(' ').join('-');
//         const permalinks = await Basicpage.find({ permalink: new RegExp(permalink) }).select('permalink');
//         if (permalinks.length > 0) {
//             permalink = `${permalink}-${permalinks.length}`;
//         }
//         res.json({ permalink });
//     } catch (err: any) {
//         logger.error(NAMESPACE, 'Permalink generation error', err);
//         res.status(500).json(formatError('Server Error'));
//     }
// };
// Get Permalink
const getpermalinkFromTitle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    try {
        if (!req.body.title) {
            return res.status(400).json((0, error_util_1.formatError)('Invalid Title'));
        }
        let permalink = (0, misc_util_1.genSlug)(title);
        const permalinks = yield Basicpage_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
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
// Create Basicpage
const createBasicpage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, permalink } = req.body;
        const user = req.body.api_user;
        const newBasicpage = new Basicpage_model_1.default({ name, description, permalink });
        const permalinks = yield Basicpage_model_1.default.find({ permalink: new RegExp(permalink) }).select('permalink');
        if (permalinks.length > 0) {
            newBasicpage.permalink = `${newBasicpage.permalink}-${permalinks.length}`;
        }
        newBasicpage.user = user._id;
        newBasicpage.author = user.name;
        // if (req.files) {
        //     const image: any = req.files.image;
        //     //const { imageName } = req.body;
        //     const extName = image.name.split('.')[image.name.split('.').length - 1];
        //     if (!ALLOWED_EXTENSIONS.test(extName)) {
        //         return res.status(400).json(formatError('Only Image files are acceptable'));
        //     }
        //     const server = process.env.SERVER_ADDRESS;
        //     const unique_number = Date.now().toString().slice(7, -1);
        //     const url = `${path.resolve('server', 'uploads')}/${unique_number}-${image.name}`;
        //     await promisify(image.mv)(url);
        //     const imageUrl = `${server}/uploads/${unique_number}-${image.name}`;
        //     newBasicpage.image = imageUrl;
        // }
        yield newBasicpage.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Create basicpage error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.createBasicpage = createBasicpage;
// Update Basicpage
const updateBasicpage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { basicpageId, name, description, permalink } = req.body;
    try {
        const basicpageFound = yield Basicpage_model_1.default.findById(basicpageId);
        if (!basicpageFound) {
            return res.status(404).json((0, error_util_1.formatError)('Basicpage not found'));
        }
        const to_update = {
            name,
            description,
            permalink,
        };
        // if (req.files) {
        //     const image: any = req.files.image;
        //     //const { imageName } = req.body;
        //     const extName = image.name.split('.')[image.name.split('.').length - 1];
        //     if (!ALLOWED_EXTENSIONS.test(extName)) {
        //         return res.status(400).json(formatError('Only Image files are acceptable'));
        //     }
        //     const server = process.env.SERVER_ADDRESS;
        //     const unique_number = Date.now().toString().slice(7, -1);
        //     const url = `${path.resolve('server', 'uploads')}/${unique_number}-${image.name}`;
        //     await promisify(image.mv)(url);
        //     const imageUrl = `${server}/uploads/${unique_number}-${image.name}`;
        //     to_update.image = imageUrl;
        // }
        yield Basicpage_model_1.default.findByIdAndUpdate(basicpageId, to_update);
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'Update basicpage error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.updateBasicpage = updateBasicpage;
// View Single Basicpage
const singleBasicpage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const basicpageFound = yield Basicpage_model_1.default.findById(id);
        if (!basicpageFound) {
            return res.status(404).json((0, error_util_1.formatError)('No basicpage found'));
        }
        res.json(basicpageFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single basicpage error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.singleBasicpage = singleBasicpage;
// Delete Single Basicpage
const deleteBasicpage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const basicpageFound = yield Basicpage_model_1.default.findById(id);
        if (!basicpageFound) {
            return res.status(404).json((0, error_util_1.formatError)('No basicpage found'));
        }
        yield Basicpage_model_1.default.findByIdAndDelete(id);
        res.json({ msg: 'success' });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View single basicpage error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.deleteBasicpage = deleteBasicpage;
// Get All Basicpages
const getAllBasicpages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const published = req.query.published;
        if (published === 'true') {
            const basicpages = (yield Basicpage_model_1.default.find({ publish: true })).reverse();
            return res.json(basicpages);
        }
        else {
            const basicpages = (yield Basicpage_model_1.default.find({})).reverse();
            return res.json(basicpages);
        }
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, 'View all basicpages error', err);
        res.status(500).json((0, error_util_1.formatError)('Server error'));
    }
});
exports.getAllBasicpages = getAllBasicpages;
