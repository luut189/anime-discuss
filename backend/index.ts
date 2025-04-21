import { ENV } from '@/common/constants';
import connectMongoDB from '@/config/db';
import { AnimeRoute, AuthRoute, ThreadRoute, UserRoute } from '@/routes';

import express from 'express';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

const app = express();
const __dirname = path.resolve();

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
