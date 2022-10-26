import express, { NextFunction, Request, Response } from 'express';
import next from 'next';
import path from 'path';
import { config as dotenv } from 'dotenv';
import { connectDB } from './config/db.config';
import logger from './config/logger';
import fileUpload from 'express-fileupload';
import fs from 'fs/promises';
import cors from 'cors';

const NAMESPACE = 'Server';

dotenv();

const dev = process.env.NODE_ENV !== 'production';

const PORT = process.env.PORT;

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Routers
import authRouter from './routers/auth.router';
import userRouter from './routers/users.router';
import categorieRouter from './routers/categories.router';
import rateRouter from './routers/rates.router';
import receiptRouter from './routers/receipts.router';

nextApp
    .prepare()
    .then(async () => {
        const app = express();

        connectDB();

        app.use(express.json());
        app.use(cors());
        app.use(express.urlencoded({ extended: false }));
        // app.use(cors());
        app.use(express.static(path.resolve('server', 'uploads')));
        app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' }));
        await fs.mkdir(path.resolve('server', 'uploads'), { recursive: true });

        app.use('/uploads', express.static(path.resolve('server', 'uploads')));

        app.use('/api/auth', authRouter);
        app.use('/api/users', userRouter);
        app.use('/api/categories', categorieRouter);
        app.use('/api/rates', rateRouter);
        app.use('/api/receipts', receiptRouter);

        app.get('*', (req: Request, res: Response) => handle(req, res));

        app.listen(PORT, () => logger.info(NAMESPACE, `Server running in port --> ${PORT}`));
    })
    .catch((reason) => console.log(reason));
