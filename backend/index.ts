import express from 'express';
import { PORT } from '@/common/constants';

const app = express();

app.use(express.json());

app.listen(PORT, () => {
    console.log('Server started at http://localhost:' + PORT);
});
