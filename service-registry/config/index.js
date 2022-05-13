// Dependencies
const { name, version } = require('../package.json');

module.exports = {
    development: {
        name,
        version,
        timeout: 60
    }
};