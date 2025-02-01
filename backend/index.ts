import { ENV_VARS } from '@/common/constants';
import animeRoute from '@/routes/anime.route';

import express from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';

const app = express();
const limiter = rateLimit({
    windowMs: 1000,
    max: 1,
    message: 'Too many requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(express.json());
app.use(cors());
app.use('/anime', limiter, animeRoute);

app.listen(ENV_VARS.PORT, () => {
    console.log('Server started at http://localhost:' + ENV_VARS.PORT);
});
