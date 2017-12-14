var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + process.env.IP + '/TodoApp');

module.exports = {
    mongoose
};