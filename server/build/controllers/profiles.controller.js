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
exports.getProfileByUser = exports.deleteProfile = exports.getSingleProfile = exports.getProfileList = exports.updateProfile = exports.createProfile = void 0;
const logger_1 = __importDefault(require("../config/logger"));
const Profile_model_1 = __importDefault(require("../models/Profile.model"));
const error_util_1 = require("../utils/error.util");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const upload_util_1 = require("../utils/upload.util");
const NAMESPACE = "Profile Controller";
const ALLOWED_IMAGE_EXTENSIONS = /png|jpg|jpeg|webp/;
const ALLOWED_FILE_EXTENSIONS = /pdf|doc|docx/;
// Create Profile
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { club_name, nccp_number, club_number, about_us, offered_programms, contact_name, address, tel, cell, email, website, incorporation_number, facebook, twitter, instagram, youtube, linkedin, canskateexcellence, excellencedetails, coaches, owners, } = req.body;
        const user = req.body.api_user;
        const newProfile = new Profile_model_1.default({
            club_name,
            nccp_number,
            club_number,
            about_us,
            offered_programms,
            contact_name,
            address,
            tel,
            cell,
            email,
            website,
            incorporation_number,
            facebook,
            twitter,
            instagram,
            youtube,
            linkedin,
            canskateexcellence,
            excellencedetails,
            coaches,
            owners,
        });
        newProfile.user = user._id;
        if (req.files) {
            const profile_image = req.files.profile_image;
            const club_logo = req.files.club_logo;
            const documents = req.files.documents;
            const profileExtName = profile_image.name.split(".")[profile_image.name.split(".").length - 1];
            const logoExtName = club_logo.name.split(".")[club_logo.name.split(".").length - 1];
            const docExtName = documents.name.split(".")[documents.name.split(".").length - 1];
            if (!ALLOWED_IMAGE_EXTENSIONS.test(profileExtName)) {
                return res
                    .status(400)
                    .json((0, error_util_1.formatError)("Only Image files are acceptable for profile image"));
            }
            if (!ALLOWED_IMAGE_EXTENSIONS.test(logoExtName)) {
                return res
                    .status(400)
                    .json((0, error_util_1.formatError)("Only Image files are acceptable for club logo"));
            }
            if (!ALLOWED_FILE_EXTENSIONS.test(docExtName)) {
                return res
                    .status(400)
                    .json((0, error_util_1.formatError)("Only pdf, doc and docx files are acceptable for documents"));
            }
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            const user = req.body.api_user;
            yield promises_1.default.mkdir(path_1.default.resolve("server", "uploads", user._id), {
                recursive: true,
            });
            const profileURL = `${path_1.default.resolve("server", "uploads", user._id)}/${unique_number}-${profile_image.name}`;
            const logoURL = `${path_1.default.resolve("server", "uploads", user._id)}/${unique_number}-${club_logo.name}`;
            const docURL = `${path_1.default.resolve("server", "uploads", user._id)}/${unique_number}-${documents.name}`;
            yield (0, util_1.promisify)(profile_image.mv)(profileURL);
            yield (0, util_1.promisify)(club_logo.mv)(logoURL);
            yield (0, util_1.promisify)(documents.mv)(docURL);
            const profileImageUrl = `${server}/uploads/${user._id}/${unique_number}-${profile_image.name}`;
            const logoImageUrl = `${server}/uploads/${user._id}/${unique_number}-${club_logo.name}`;
            const documentsUrl = `${server}/uploads/${user._id}/${unique_number}-${documents.name}`;
            newProfile.profile_image = profileImageUrl;
            newProfile.club_logo = logoImageUrl;
            newProfile.documents = [documentsUrl];
        }
        yield newProfile.save();
        res.json({ success: true });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Create profile error", err);
        res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.createProfile = createProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body);
    const { profileId, club_name, nccp_number, club_number, about_us, offered_programms, contact_name, address, tel, cell, email, website, incorporation_number, facebook, twitter, instagram, youtube, linkedin, canskateexcellence, excellencedetails, coaches, owners, } = req.body;
    const user = req.body.api_user;
    try {
        const profileFound = yield Profile_model_1.default.findById(profileId);
        if (!profileFound) {
            return res.status(404).json((0, error_util_1.formatError)("Profile not found"));
        }
        const to_update = {
            club_name,
            nccp_number,
            club_number,
            about_us,
            offered_programms: JSON.parse(offered_programms),
            contact_name,
            address,
            tel,
            cell,
            email,
            website,
            incorporation_number,
            facebook,
            twitter,
            instagram,
            youtube,
            linkedin,
            canskateexcellence,
            excellencedetails,
            coaches: JSON.parse(coaches),
            owners: JSON.parse(owners),
        };
        if (req.files) {
            const server = process.env.SERVER_ADDRESS;
            const unique_number = Date.now().toString().slice(7, -1);
            const user = req.body.api_user;
            yield promises_1.default.mkdir(path_1.default.resolve("server", "uploads", user._id), {
                recursive: true,
            });
            if (req.files.profile_image) {
                const profile_image = req.files.profile_image;
                const profileExtName = profile_image.name.split(".")[profile_image.name.split(".").length - 1];
                if (!ALLOWED_IMAGE_EXTENSIONS.test(profileExtName)) {
                    return res
                        .status(400)
                        .json((0, error_util_1.formatError)("Only Image files are acceptable for profile image"));
                }
                const profileImageUrl = yield (0, upload_util_1.uploadFileToCDN)(profile_image, profile_image.name);
                to_update.profile_image = profileImageUrl;
            }
            if (req.files.club_logo) {
                const club_logo = req.files.club_logo;
                const logoExtName = club_logo.name.split(".")[club_logo.name.split(".").length - 1];
                if (!ALLOWED_IMAGE_EXTENSIONS.test(logoExtName)) {
                    return res
                        .status(400)
                        .json((0, error_util_1.formatError)("Only Image files are acceptable for club logo"));
                }
                const logoImageUrl = yield (0, upload_util_1.uploadFileToCDN)(club_logo, club_logo.name);
                to_update.club_logo = logoImageUrl;
            }
            if (req.files.documents) {
                const documents = req.files.documents;
                const documentUrls = [];
                documents.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
                    const logoImageUrl = yield (0, upload_util_1.uploadFileToCDN)(doc, doc.name);
                    documentUrls.push(logoImageUrl);
                }));
                to_update.documents = documentUrls;
            }
        }
        yield Profile_model_1.default.findByIdAndUpdate(profileId, to_update);
        res.status(200).json({ msg: "Updated profile" });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Error updating profile", err);
        return res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.updateProfile = updateProfile;
const getProfileList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield Profile_model_1.default.find();
        res.json(profiles);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Error getting profiles");
        return res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.getProfileList = getProfileList;
const getSingleProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profileFound = yield Profile_model_1.default.findById(id);
        if (!profileFound) {
            return res.status(404).json((0, error_util_1.formatError)("No profile found"));
        }
        res.json(profileFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "View single profile error", err);
        res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.getSingleProfile = getSingleProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const profileFound = yield Profile_model_1.default.findById(id);
        if (!profileFound) {
            return res.status(404).json((0, error_util_1.formatError)("Profile not found"));
        }
        const deleted = yield Profile_model_1.default.findByIdAndDelete(id);
        res.json({ msg: "Deleted profile" });
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Error deleting profile");
        return res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.deleteProfile = deleteProfile;
const getProfileByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const profileFound = yield Profile_model_1.default.findOne({ user: userId });
        if (!profileFound) {
            return res.status(404).json((0, error_util_1.formatError)("Profile not found"));
        }
        res.json(profileFound);
    }
    catch (err) {
        logger_1.default.error(NAMESPACE, "Error Fetching profile by user", err);
        return res.status(500).json((0, error_util_1.formatError)("Server error"));
    }
});
exports.getProfileByUser = getProfileByUser;
