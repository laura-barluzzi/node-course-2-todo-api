const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

const todos = [
    {
        _id: new ObjectId,
        text: 'First test todos'
    },
    {
        _id: new ObjectId,
        text: 'Second text todos',
        completed: true,
        completedAt: 12345
    }
];

// Runs before each test case to empty Todo collection
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
});

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