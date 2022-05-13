// Format IP Address
module.exports = req => {
    const addr = req.connection.remoteAddress;
    return addr.includes('::') ? `[${addr}]` : addr;
};