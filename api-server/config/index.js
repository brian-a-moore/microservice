// Dependencies
const { name, version } = require('../package.json');

module.exports = {
    development: {
        name,
        version,
        serviceRegistryUrl: 'http://localhost:4000',
        serviceVersion: '1.x.x'
    }
};