const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectId;
const userTwoId = new ObjectId;

const users = [{
    _id: userOneId,
    email: 'user1@gmail.com',
    password: 'user1password',
    tokens: [{
        'access': 'auth',
        'token': jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},
{
    _id: userTwoId,
    email: 'user2@gmail.com',
    password: 'user2password',
    tokens: [{
        'access': 'auth',
        'token': jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [
    {
        _id: new ObjectId,
        _creator: userOneId,
        text: 'First test todos'
    },
    {
        _id: new ObjectId,
        _creator: userTwoId,
        text: 'Second text todos',
        completed: true,
        completedAt: 12345
    }
];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
}

module.exports = {todos, populateTodos, users, populateUsers}