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

describe('POST /todos', () => {
    it('Should create a new todo', (done) => {
        var text = "Test /todo text";

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

describe("GET /todos", () => {
    it('Should return list of todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1)
            })
            .end(done)
    });
});

describe("GET /todos/:id", () => {
    it('Should return todo with given id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done)
    });
    
    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });
    
    it('should not return a todo doc created by other users', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });
});

describe("DELETE /todos/:id", () => {
    it('Should remove todo with given id', (done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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
    
    it('hould not remove todo created by another user', (done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {return done(err)};

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e))
                
            })
    });
    
    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });
    
    it('should return a 404 for invalid id', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var newText = 'Updated test text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[1].tokens[0].token)
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
    
    it('should not update the todo of another user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var newText = 'Updated test text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text: newText
            })
            .expect(404)
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
                }).catch((e) => done(e));
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

describe('POST /users/login', () => {
    
    it('should login when correct credentials', (done) => {

        request(app)
            .post('/users/login')
            .send({email: users[1].email, password: users[1].password})
            .expect(200)
            .expect((res) => {
                expect(res.header['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) { return done(err) };
                
                User.findById(users[1]._id).then((user) => {
                    console.log(user.tokens);
                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.header['x-auth']
                    });
                    done();
                }).catch((e) => done(e));
            })
    });
    
    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({email: 'invalid', password: '123'})
            .expect(400)
            .expect((res) => {
                expect(res.header['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) { return done(err) };
                
                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            })
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) { done(err) };
                User.findById(users[0]._id).then((user) => {
                    if (!user) { return done(err) };
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});