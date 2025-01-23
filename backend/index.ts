import { ENV_VARS } from '@/common/constants';
import animeRoute from '@/routes/anime.route';

import express from 'express';

const app = express();

app.use(express.json());
app.use('/anime', animeRoute);

app.listen(ENV_VARS.PORT, () => {
    console.log('Server started at http://localhost:' + ENV_VARS.PORT);
});
