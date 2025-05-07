import { ENV } from '@/common/constants';
import connectMongoDB from '@/config/db';
import { AnimeRoute, AuthRoute, ThreadRoute, UserRoute } from '@/routes';

import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
app.set('trust proxy', 1);

const __dirname = path.resolve();
const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again in 1 second',
});

cloudinary.config({
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_API_SECRET,
});

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/anime', AnimeRoute);
app.use('/api/thread', ThreadRoute);

if (ENV.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(ENV.PORT, () => {
    console.log('Server started at http://localhost:' + ENV.PORT);
    connectMongoDB();
});
