const {ObjectId} = require('mongodb');

const mongoose = require('./../server/db/mongoose')
const {Todo} = require('./../server/models/todo')
const {User} = require('./../server/models/user')

// // removes everything. result = num of removed entries
// Todo.remove({}).then((result) => console.log(result));


// // the following return the docs instead
// Todo.findOneAndRemove()

Todo.findByIdAndRemove('5a4e5174b4830b0b847bfac5').then((todo) => console.log(todo));