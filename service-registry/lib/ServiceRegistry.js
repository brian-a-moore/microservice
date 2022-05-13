// Dependencies
const semver = require('semver');
const { LOG_TYPES } = require('../config/enum');
const logger = require('../utils/logger');

// Service Registry
class ServiceRegistry {
    constructor({ timeout }) {
        this.services = {};
        this.timeout = timeout;
    };

    retrieve(name, version) {
        this.cleanup();

        const services = Object.values(this.services)
            .filter(service => service.name == name && semver.satisfies(service.version, version));

        return services[Math.floor(Math.random() * services.length)];
    };

    register(name, version, ip, port) {
        this.cleanup();

        const key = name + version + ip + port;

        if(!this.services[key]) {
            this.services[key] = {
                timestamp: Math.floor(new Date() / 1000),
                ip,
                port,
                name,
                version
            };

            logger({
                type: LOG_TYPES.LOG.type,
                message: `Registered Service: ${key}`
            });

            return key;
        }
    };

    deregister(name, version, ip, port) {
        const key = name + version + ip + port;

        if(this.services[key]) {
            delete this.services[key];

            logger({
                type: LOG_TYPES.LOG.type,
                message: `Deregistered Service: ${key}`
            });
        };

        return key;
    };

    cleanup() {
        const now = Math.floor(new Date() / 1000);

        Object.keys(this.services).forEach(key => {
            if(this.services[key].timestamp + this.timeout < now) {
                delete this.services[key];

                logger({
                    type: LOG_TYPES.LOG.type,
                    message: `Service Timeout: Deregistered Service: ${key}`
                });
            }
        });
    };

};

module.exports = ServiceRegistry;