const { User, List, Sequelize } = require('../models');
const { validate } = require('../../utils/Constants')

const create = async(req, res) => {
    try {
        const { valid, reason } = validate({ name: String }, req.body);
        if (!valid) throw new Error(reason)
        const list = await List.create({ name: req.body.name, status: false });
        const user = await User.findById(req.user.id);
        await user.addList(list,  { through: { owner: true }} );
        res.send(list);
    } catch (error) {
        res.send({ error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const { valid, reason } = validate({ name: String }, req.body);
        if (!valid)throw new Error(reason)
        const list = await List.findById(req.params.listId);
        if (!list) throw new Error("The list doesn't exist");
        list.update({ name: req.body.name });
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const changeStatus = async (req, res) => {
    try {
        let list = await List.findById(req.params.id);
        if (!list) throw new Error("List not found");
        list = await list.update({ status: !list.status });
        res.send(list)
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
}

const list = async(req, res) => {
    try {
        const lists = await List.findAll({
            raw: true,
            attributes: { exclude: ['createdAt'] },
            include: [{
                model: User,
                attributes: [ 'name', 'username', 'avatar' ],
                through: {
                    attributes: []
                }
            }]
        });
        res.send(lists)
    } catch (error) {
        res.send(error)
    }
}

const myLists = async(req, res) => {
    try {
        const lists = await List.findAll({
            where: {
                id: {
                    $in: Sequelize.literal( `(
                        SELECT "Lists".id
                        FROM
                        "Lists" INNER JOIN "UserLists"
                        ON "Lists"."id" = "UserLists"."ListId" and "UserLists"."UserId" = ${req.user.id}
                    )`)
                }
            },
            include: [{
                model: User,
                attributes: [ "id", "name", "avatar" ],
                through: { as: 'listInfo', attributes: [ 'owner' ], }
            }]
        })
        res.send(lists)
    } catch (error) {
        console.log(error)
        res.send({ error })
    }
}

const addUserToList = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) throw new Error("user not found");

        const list = await List.findById(req.params.listId);
        await user.addList(list, { owner: false } )
        res.send({ user, list });
    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = {
    list,
    create,
    myLists,
    addUserToList,
    update,
    changeStatus
}