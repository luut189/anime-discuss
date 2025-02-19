import { ENV } from '@/common/constants';
import connectMongoDB from '@/config/db';
import animeRoute from '@/routes/anime.route';
import threadRoute from '@/routes/thread.route';

import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/anime', animeRoute);
app.use('/thread', threadRoute);

app.listen(ENV.PORT, () => {
    console.log('Server started at http://localhost:' + ENV.PORT);
    connectMongoDB();
});
