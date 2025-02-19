import { ENV } from '@/common/constants';
import connectMongoDB from '@/config/db';
import animeRoute from '@/routes/anime.route';
import threadRoute from '@/routes/thread.route';

import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use('/anime', animeRoute);
app.use('/thread', threadRoute);

if (ENV.NOV_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}

app.listen(ENV.PORT, () => {
    console.log('Server started at http://localhost:' + ENV.PORT);
    connectMongoDB();
});
