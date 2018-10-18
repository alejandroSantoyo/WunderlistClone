const { users, lists, tasks } = require('../controllers');

module.exports = (app) => {
    app.get('/api/v1', (req, res) => res.status(200).send({ message: 'Welcome to the Todos API!' }));

    // users
    app.post('/api/v1/login', users.login)
    app.post('/api/v1/users', users.create)
    app.get('/api/v1/users', users.loginRequired, users.list)
    app.get('/api/v1/profile', users.loginRequired, users.profile)

    // lists
    app.get('/api/v1/my-lists', users.loginRequired, lists.myLists)
    app.post('/api/v1/lists', users.loginRequired, lists.create)
    app.put("/api/v1/lists/:listId", users.loginRequired, lists.update)
    app.put("/api/v1/lists/:id/status", lists.changeStatus)
    app.post('/api/v1/list/:listId/user/:userId', lists.addUserToList)

    // tasks
    app.get("/api/v1/lists/:id/tasks", users.loginRequired, tasks.list)
    app.post('/api/v1/lists/:id/tasks', users.loginRequired, tasks.create)
    app.put('/api/v1/tasks/:id', users.loginRequired, tasks.update)
    app.put('/api/v1/tasks/:id/assign-user', users.loginRequired, tasks.assignUser)
}