const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

var data = {id: 10};

var token = jwt.sign(data, '123');

var decoded = jwt.verify(token, '123');
console.log(decoded); 

// var message = 'I am Laura Barluzzi';

// SHA256(message).toString();

// var data = {id: 4};

// var token = { data, hash: SHA256(JSON.stringify(data) + 'somesecret').toString() }