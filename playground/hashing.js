const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    if (err) {};
    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {};
        console.log(hash);
    })
});

var hash = '$2a$10$xAslI6MgJJ/PTjcfh0XmougQZG9VIYq.ZACQ5El6mhnjhLWtR/AyW';

bcrypt.compare(password, hash, (err, result) => console.log(result));

// const jwt = require('jsonwebtoken');

// var data = {id: 10};

// var token = jwt.sign(data, '123');

// var decoded = jwt.verify(token, '123');
// console.log(decoded); 

// // var message = 'I am Laura Barluzzi';

// // SHA256(message).toString();

// // var data = {id: 4};

// // var token = { data, hash: SHA256(JSON.stringify(data) + 'somesecret').toString() }