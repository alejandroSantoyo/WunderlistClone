const { Task, User, List, UserTasks } = require('../models');
const { validate } = require('../../utils/Constants');

const list = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { listId: req.params.id },
            attributes: { exclude: ["listId"] },
            order: [ ["id", "DESC"] ],
            include: [{
                model: User,
                as: 'users',
                attributes: ["id", "name", "avatar"],
                through: { attributes: [] }
            }],
        });
        res.send(tasks);
    } catch (error) {
        res.send({ error: error.message })
    }
}

const create = async (req, res) => {
    try {
        const { valid, reason } = validate({ dead_line: String, title: String,  }, req.body )
        if (!valid) throw new Error(reason)
        const list = await List.findById(req.params.id, { raw: true });
        if (!list) throw new Error("List not found")
        const task = await Task.create({ ...req.body, listId: list.id, dead_line: new Date(req.body.dead_line) });
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const { valid, reason } = validate({ dead_line: String, title: String, status: Boolean, }, req.body);
        if (!valid) throw new Error(reason);
        let task = await Task.findById(req.params.id);
        if (!task) throw new Error("Task not found");
        const finish_date = req.body.status ? new Date() : null
        task = await task.update({ ...req.body, dead_line: new Date(req.body.dead_line), finish_date });
        res.send(task)
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

const assignUser = async (req, res) => {
    try {
        const { valid, reason } = validate({ users: Array }, req.body);
        if (!valid) throw new Error(reason);
        let task = await Task.findById(req.params.id);
        if (!task) throw new Error("Task not found");
        const users = await User.findAll({ where: { id: { $in: req.body.users.map( user => user.id) } } })
        await task.setUsers(users)
        res.send(task)
    } catch (error) {
        res.send({ error: error.message })
    }
}

const removeUser = async (req,res) => {
    try {
        const { valid, reason } = validate({ user: Object }, req.body);
        if (!valid) throw new Error(reason)
        const userTask = await UserTasks.find({ where: { TaskId: req.params.id, UserId: req.body.user.id } })
        if (!userTask) throw new Error("User not found")
        await userTask.destroy();
        res.send({ status: "ok", message: "User removed" })
    } catch (error) {
        // if (error.message == "Cannot read property '_modelOptions' of undefined") res.status(200).send({ status: "ok", message: "User removed" })
        res.status(400).send({ error: error.message })
    }
}

const destroy = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) throw new Error("Task not found")
        await task.destroy();
        res.send({ message: "Task deleted", status: "ok" })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

module.exports = {
    list,
    create,
    update,
    assignUser,
    removeUser,
    destroy
}