var env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://' + process.env.IP + '/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 8080;
  process.env.MONGODB_URI = 'mongodb://' + process.env.IP + '/TodoAppTest'
}