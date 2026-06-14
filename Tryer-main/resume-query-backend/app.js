const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { env } = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const { requestLogger } = require('./middleware/requestLogger');

const app = express();

app.use(cors({ origin: env.clientUrl === '*' ? true : env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Tryer API is healthy',
    data: { uptime: process.uptime() },
  });
});

app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
