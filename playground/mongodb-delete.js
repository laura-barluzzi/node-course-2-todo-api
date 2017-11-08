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

    // deleteMany
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log(result);
    // });
    
    // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log(result)
    // });

    // findOneandDelete -- deleteOne but returns the deleted value
    // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
    //     console.log(result)
    // });
    // db.collection('Todos').find().toArray().then((docs) => {
    //     console.log(docs)
    // });
    
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log('Deleted docs with text = Eat lunch');
    // });
    
    db.collection('Todos').findOneAndDelete({
        _id: new ObjectID('5a0340293d274211f277a13b')
    }).then((doc) => {
        console.log('Delete only this document:');
        console.log(doc);
    });
    //db.close();
});