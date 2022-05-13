// Dependencies
const chalk = require('chalk');
const { LOG_TYPES } = require('../config/enum');

// Logger
module.exports = log => {
    const logType = LOG_TYPES[log.type];

    console.log(
        chalk`{${
            logType.bg
        }.bold ${` ${logType.type}: `}}\n{bold Message:} ${
            log.message
        }\n{grey.bold Timestamp:} {grey ${new Date()}}\n`
    );
};
