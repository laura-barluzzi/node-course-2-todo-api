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
    
    // find() returns a pointer/cursor to the document
    // db.collection('Todos').find({
    //     _id: new ObjectID('5a0340293d274211f277a13b')
    // }).toArray().then((docs) => {
    //     console.log('Todos:');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch Todos.')
    // }); 
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch Todos.')
    // });

    db.collection('Users').find({name: 'Jane'})
        .toArray().then((docs) => {
        console.log('Users:');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Users.')
    }); 
    //db.close();
});

