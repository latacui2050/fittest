const mongoose = require('mongoose');
require('dotenv').config();

// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://root:root@cluster0.jtey2ed.mongodb.net/');
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ellencui15:bXyHZOo3MPjCsoSQ@cluster0.6y62e01.mongodb.net/firstdb?retryWrites=true&w=majority/');

module.exports = mongoose.connection;


