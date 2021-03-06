const { users, lists, tasks } = require('../controllers');
const multer  = require('multer')
const upload = multer()

module.exports = (app) => {
    app.get('/api/v1', (req, res) => res.status(200).send({ message: 'Welcome to the Todos API!' }));

    // users
    app.post('/api/v1/login', users.login)
    app.post('/api/v1/users', users.create)
    app.get('/api/v1/users', users.loginRequired, users.list)
    app.get('/api/v1/profile', users.loginRequired, users.profile)
    app.put('/api/v1/profile/', users.loginRequired, users.update)
    app.put('/api/v1/profile/avatar', users.loginRequired, upload.single('avatar'), users.uploadAvatar)

    // lists
    app.get('/api/v1/my-lists', users.loginRequired, lists.myLists)
    app.post('/api/v1/lists', users.loginRequired, lists.create)
    app.put("/api/v1/lists/:listId", users.loginRequired, lists.update)
    app.put("/api/v1/lists/:id/status", users.loginRequired, lists.changeStatus)
    app.post('/api/v1/list/:listId/user/:userId', users.login, lists.addUserToList)
    app.delete('/api/v1/lists/:id', users.loginRequired, lists.destroy)

    // tasks
    app.get("/api/v1/lists/:id/tasks", users.loginRequired, tasks.list)
    app.post('/api/v1/lists/:id/tasks', users.loginRequired, tasks.create)
    app.put('/api/v1/tasks/:id', users.loginRequired, tasks.update)
    app.put('/api/v1/tasks/:id/assign-user', users.loginRequired, tasks.assignUser)
    app.put('/api/v1/tasks/:id/remove-user', users.loginRequired, tasks.removeUser)
    app.delete('/api/v1/tasks/:id', users.loginRequired, tasks.destroy)
}