const { Task, User, List } = require('../models');
const { validate } = require('../../utils/Constants');

const list = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { listId: req.params.id },
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

module.exports = {
    list
}