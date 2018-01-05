var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  };
  
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    };
    res.send({todo});
  }, (e) => {
    res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  };
  
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    };
    res.send({todo});
  }, (e) => res.status(400).send());
});

// app.post('/users', (req, res) => {
//   var user = new User({
//     email: req.body.email
//   });

//   user.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

// app.get('/users', (req, res) => {
//   User.find().then((users) => {
//     res.send({users});
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

app.listen(port, () => {
    console.log(`Listening to port: ${port}`);
});

module.exports = {app};