var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
  var config = require('./config.json');
  var envConfig = config[env];
  
  Object.keys(envConfig).forEach((key) => {
    if (key === "MONGODB_URI") {
      process.env[key] = `mongodb://${process.env.IP}` + envConfig[key];
    } else {
      process.env[key] = envConfig[key];
    }
  });
}

// console.log('loaded config');

// if (env === 'development') {
//   process.env.PORT = 8080;
//   process.env.MONGODB_URI = 'mongodb://' + process.env.IP + '/TodoApp';
// } else if (env === 'test') {
//   process.env.PORT = 8080;
//   process.env.MONGODB_URI = 'mongodb://' + process.env.IP + '/TodoAppTest'
// }