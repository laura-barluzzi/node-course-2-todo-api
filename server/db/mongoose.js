var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://' + process.env.IP + '/TodoApp');

module.exports = {
    mongoose
};