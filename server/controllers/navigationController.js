const path = require('path');

const getIndex = (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
};

module.exports = { getIndex };