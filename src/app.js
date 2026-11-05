import express from 'express';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Auth JWT MVC API is running' });
});

app.use('/api', routes);

// Xử lý route không tồn tại & lỗi tập trung
app.use(notFound);
app.use(errorHandler);

export default app;
