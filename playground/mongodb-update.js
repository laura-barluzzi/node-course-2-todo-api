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
    
    // db.collection('Users').find().toArray().then((docs) => {
    //     console.log(docs);
    // });

    // findOneAndUpdate()
    db.collection('Todos').findOneAndUpdate({
            _id: new ObjectID('5a033e3ab779d111bac13348')
        }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });
    
    db.collection('Users').findOneAndUpdate({
            _id: new ObjectID('5a0342b8f6a59b126efc12d1')
        }, {
            $set: {name: 'Laura'},
            $inc: {age: 1}
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });

    //db.close();
});