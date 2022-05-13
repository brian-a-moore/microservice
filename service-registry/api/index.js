// Dependencies
const router = require('express').Router();
const { STATUS_CODES, LOG_TYPES, ENVIRONMENTS } = require('../config/enum');
const logger = require('../utils/logger');
const getIpAddress = require('../utils/ip');
const config = require('../config')[process.env.NODE_ENV || ENVIRONMENTS.DEV];
const ServiceRegistry = require('../lib/ServiceRegistry');

// Service Registry
const serviceRegistry = new ServiceRegistry(config);

// Retrieve Service
router.get('/retrieve/:name/:version', (req, res) => {
    const { name, version } = req.params;
    const retrievedService = serviceRegistry.retrieve(name, version);

    if(!retrievedService) {
        return res.status(404).json({
            result: {
                action: 'RETRIEVAL',
                service: null,
                message: 'Service not found'
            }
        });
    };

    return res.json({
        result: {
            action: 'RETRIEVAL',
            service: retrievedService
        }
    });
});

// Register Service
router.put('/register/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;
    const ip = getIpAddress(req);
    const key = serviceRegistry.register(name, version, ip, port);
    
    return res.json({
        result: {
            action: 'REGISTERED',
            key
        }
    });
});

// Deregister Service
router.delete('/deregister/:name/:version/:port', (req, res) => {
    const { name, version, port } = req.params;
    const ip = getIpAddress(req);

    const key = serviceRegistry.deregister(name, version, ip, port);

    return res.json({
        result: {
            action: 'DEREGISTERED',
            key
        }
    });
});

// Error Handler
router.use((err, req, res, next) => {
    res.status(err.status || STATUS_CODES.SERVER_ERROR);

    logger({
        type: LOG_TYPES.ERROR,
        message: err.message
    });

    res.json({
        error: {
            message: err.message
        }
    });
});

module.exports = router;