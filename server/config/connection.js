const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.jtey2ed.mongodb.net/');

module.exports = mongoose.connection;


