// Dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const { ENVIRONMENTS, STATUS_CODES, LOG_TYPES } = require('./config/enum');
const logger = require('./utils/logger');

// Environment Variables
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || ENVIRONMENTS.DEV;

// Configuration
const config = require('./config')[ENV];

// Application
app.listen(PORT, async () => {
    logger({
        type: LOG_TYPES.SERVER.type,
        message: `${config.name} ${config.version} online: [Environment: ${ENV} | Port: ${PORT}]`
    });
});

// Security
app.disable('x-powered-by');

// Middleware
if (ENV === ENVIRONMENTS.DEV) {
    app.use(require('morgan')('dev'));
}
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', require('./api'));

// 404 Redirect
app.all('*', (req, res) =>
    res.status(STATUS_CODES.NOT_FOUND).json({
        result: 'Route does not exist'
    })
);
