// Dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const { ENVIRONMENTS, STATUS_CODES, LOG_TYPES } = require('./config/enum');
const logger = require('./utils/logger');
const axios = require('axios');

// Environment Variables
const ENV = process.env.NODE_ENV || ENVIRONMENTS.DEV;
const SERVICE_REGISTRY_URL = 'http://localhost:4000';

// Configuration
const config = require('./config')[ENV];

// Application
const server = app.listen(0, async () => {
    const port = server.address().port;
    logger({
        type: LOG_TYPES.SERVER.type,
        message: `${config.name} ${config.version} online: [Environment: ${ENV} | Port: ${port}]`
    });

    // Service Registration
    const registerService = () => axios
        .put(`${SERVICE_REGISTRY_URL}/register/${config.name}/${config.version}/${port}`)
        .catch(err => {
            logger({
                type: LOG_TYPES.ERROR.type,
                message: err.message
            });
        });

    const deregisterService = () => axios
        .delete(`${SERVICE_REGISTRY_URL}/deregister/${config.name}/${config.version}/${port}`)
        .catch(err => {
            logger({
                type: LOG_TYPES.ERROR.type,
                message: err.message
            });
        });

    // Register Service
    registerService();

    // Cleanup Service
    const heartbeat = setInterval(registerService, 15 * 1000);

    const cleanup = async () => {
        let clean = false;
        if (!clean) {
            clean = true;
            clearInterval(heartbeat);
            await deregisterService();
        }
    };

    process.on('uncaughtException', async () => {
        await cleanup();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        await cleanup();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await cleanup();
        process.exit(0);
    });
});

// Security
app.disable('x-powered-by');

// Middleware
if (ENV === ENVIRONMENTS.DEVELOPMENT) {
    app.use(require('morgan')('dev'));
}
app.use(cors());
app.use(express.json());

// Routes
app.use('/', require('./api'));

// 404 Redirect
app.all('*', (req, res) =>
    res.status(STATUS_CODES.NOT_FOUND).json({
        result: 'Service Not Found'
    })
);
