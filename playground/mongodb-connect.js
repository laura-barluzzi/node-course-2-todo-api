// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// connect to db takes 2 args: url string, callback
// url = mongodb://${url}/name_database
var mongodbUrl = 'mongodb://' + process.env.IP + '/TodoApp';
console.log(mongodbUrl);
MongoClient.connect(mongodbUrl, (err, db) => {
    if (err) { 
        return console.log('Unable to connect to Mongodb server')
    }
    console.log('Connected to Mongo db server');
    
    // db.collection('Todos').insertOne({
    //     text: 'Something to do with truth',
    //     completed: true
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert Todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })
    
    // db.collection('Users').insertOne({
    //     name: 'Mike',
    //     age: 26,
    //     location: 'New York City'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert User', err)
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    // });
    
    db.close();
});

