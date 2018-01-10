const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectId} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed')

// Runs before each test case to empty collections
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todo', () => {
    it('Should create a new todo', (done) => {
        var text = "Test /todo text";

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            })
    });

    it('Should not create a new todo with wrong body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                console.log(res);
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e))
            });
    });
});

describe("GET /todo", () => {
    it('Should return list of todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2)
            })
            .end(done)
    });
});

describe("GET /todo/:id", () => {
    it('Should return todo with given id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });
    
    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    });
    
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe("DELETE /todo/:id", () => {
    it('Should remove todo with given id', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {return done(err)};

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e))
                
            })
    });
    
    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    });
    
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todo/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var newText = 'Updated test text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: newText
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should clear completedAt when todo not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var newText = 'Updated test text';

        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: false,
                text: newText
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(newText);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
    
    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done)
    });
});

describe('POST /users', () => {
    
    it('should create a user', (done) => {
        var email = 'example@example.com';
        var password = 'exampleUniquePassword';
        
        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) { return done(err) };
                
                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });
            })
    });
    
    it('should return validation errors if request invalid', (done) => {
        var invalidEmail = 'invalid';
        request(app)
            .post('/users')
            .send({invalidEmail})
            .expect(400)
            .end(done)
    });
    
    it('should not create user if email already in use', (done) => {

        request(app)
            .post('/users')
            .send({email: users[0].email, password: '12345678'})
            .expect(400)
            .end(done);
    });
});