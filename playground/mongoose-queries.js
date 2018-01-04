const {ObjectId} = require('mongodb');

const mongoose = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

var userId = '5a4e43d755ec4d620955a13b';

if (!ObjectId.isValid(userId)) {
   console.log('User id not valid.'); 
};

User.findById(userId).then((user) => {
    if (!user) {
        console.log('User Id not found.');
    } else {
        console.log('User by id: ', user);
    }
}).catch((e) => console.log(e));

// var id = '5a4d4946863a521f1088a5ac11';

// if (!ObjectId.isValid(id)) {
//     console.log('Id not valid.')
// };

// // Todo.find({
// //     _id: id
// // }).then((todos) => {
// //     console.log('Todos, ', todos);
// // });

// // Todo.findOne({
// //     _id: id
// // }).then((todo) => {
// //     console.log('Todo, ', todo);
// // });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found.')
//     }
//     console.log('Todo by id, ', todo);
// }).catch((e) => console.log(e));