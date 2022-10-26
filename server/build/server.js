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
const express_1 = __importDefault(require("express"));
const next_1 = __importDefault(require("next"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const db_config_1 = require("./config/db.config");
const logger_1 = __importDefault(require("./config/logger"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const promises_1 = __importDefault(require("fs/promises"));
const cors_1 = __importDefault(require("cors"));
const NAMESPACE = 'Server';
(0, dotenv_1.config)();
const dev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT;
const nextApp = (0, next_1.default)({ dev });
const handle = nextApp.getRequestHandler();
// Routers
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const users_router_1 = __importDefault(require("./routers/users.router"));
const events_router_1 = __importDefault(require("./routers/events.router"));
const roles_routers_1 = __importDefault(require("./routers/roles.routers"));
const upload_router_1 = __importDefault(require("./routers/upload.router"));
const webinars_router_1 = __importDefault(require("./routers/webinars.router"));
const basicpages_router_1 = __importDefault(require("./routers/basicpages.router"));
const jobPosting_router_1 = __importDefault(require("./routers/jobPosting.router"));
const announcements_router_1 = __importDefault(require("./routers/announcements.router"));
const resources_router_1 = __importDefault(require("./routers/resources.router"));
const profiles_router_1 = __importDefault(require("./routers/profiles.router"));
const tags_router_1 = __importDefault(require("./routers/tags.router"));
const footerNavs_router_1 = __importDefault(require("./routers/footerNavs.router"));
const emails_router_1 = __importDefault(require("./routers/emails.router"));
nextApp
    .prepare()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    (0, db_config_1.connectDB)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: false }));
    // app.use(cors());
    app.use(express_1.default.static(path_1.default.resolve('server', 'uploads')));
    app.use((0, express_fileupload_1.default)({ useTempFiles: true, tempFileDir: '/tmp/' }));
    yield promises_1.default.mkdir(path_1.default.resolve('server', 'uploads'), { recursive: true });
    app.use('/uploads', express_1.default.static(path_1.default.resolve('server', 'uploads')));
    app.use('/api/auth', auth_router_1.default);
    app.use('/api/users', users_router_1.default);
    app.use('/api/events', events_router_1.default);
    app.use('/api/roles', roles_routers_1.default);
    app.use('/api/upload-image', upload_router_1.default);
    app.use('/api/webinars', webinars_router_1.default);
    app.use('/api/basicpages', basicpages_router_1.default);
    app.use('/api/job-postings', jobPosting_router_1.default);
    app.use('/api/announcements', announcements_router_1.default);
    app.use('/api/resources', resources_router_1.default);
    app.use('/api/tags', tags_router_1.default);
    app.use('/api/profiles', profiles_router_1.default);
    app.use('/api/footerNavs', footerNavs_router_1.default);
    app.use('/api/emails', emails_router_1.default);
    app.get('*', (req, res) => handle(req, res));
    app.listen(PORT, () => logger_1.default.info(NAMESPACE, `Server running in port --> ${PORT}`));
}))
    .catch((reason) => console.log(reason));
