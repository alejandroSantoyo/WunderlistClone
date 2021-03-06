const { User, List, Sequelize } = require('../models');
const { validate, ip } = require('../../utils/Constants');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginRequired = (req, res, next) => {
    if (req.user) return next()
    res.status(401).send({ message: "Login required" })
}

const create = async (req, res) => {
    try {
        const { valid, reason } = validate({ name: String, username: String, password: String, email: String }, req.body);
        if (!valid) throw new Error(reason)
        const { username, password } = req.body;
        req.body.password = await bcrypt.hash(password, 12);
        const exist = await User.find({ where: { username } });
        if (exist) throw new Error("User exist")
        const user = await User.create(req.body, { attributes: { exclude: ['password'] } })
        res.send({ user })
    } catch (error) {
        res.send({ error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.find({
            where: { username },
            attributes: [ 'id', 'name', 'password', ],
            raw: true
        });
        if (!user) throw new Error("User does not exist");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Password does not match")
        delete user.password
        res.send({ ...user, token: jwt.sign({ ...user }, 'wunderlistCloneSecret') })
    } catch (error) {
        res.send({ error: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, {
            attributes: ['id', 'username', 'email', 'name'],
            include: [{
                model: List,
                attributes: ['id', 'name', 'status'],
                through: {
                    attributes: []
                    // attributes: {
                    //     exclude: [ 'ListId', 'createdAt', 'updatedAt' ],
                    // },
                }
            }],
        });
        if (!user) throw new Error("User not found")
        res.send(user)
    } catch (error) {
        console.log(error)
        res.send({ error: error.message })
    }
}

const list = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                id: { [Sequelize.Op.notIn]: [ req.user.id ]} // get all users exepct me
            }
            // include: [{
            //     model: List,
            //     through: {
            //         attributes: ['name', 'status'],
            //     }
            // }]
        });
        res.send({ users })
    } catch (error) {
        console.log(error, "error");
        res.send({ error })
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id, { attributes: { exclude: [ 'password', 'updatedAt' ] } });
        if (!user) throw new Error("User not found")
        res.send(user)
    } catch (error) {
        res.send({ error: error.message })
    }
}

const update = async (req, res) => {
    try {
        const { valid, reason } = validate({ name: String, email: String, type: String }, req.body);
        if (!valid) throw new Error(reason)
        let user = await User.findById(req.user.id);
        if (req.body.type == "name"){
            user = await user.update({ name: req.body.name });
        } else {
            const match = await bcrypt.compare(req.body.password, user.password);
            if (!match) throw new Error("Password don't match")
            user = await user.update({ email: req.body.email })
        }
        res.send(user)
    } catch (error) {
        res.status(400).send({ status: "error", error: error.message });
    }
}

const uploadAvatar = async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        fs.writeFileSync(`./public/users-avatars/${req.user.id}.jpg`, req.file.buffer )
        user = await user.update({ avatar: `/users-avatars/${req.user.id}.jpg` })
        res.send(user)
    } catch (error) {
        res.send({ error: error.message })
    }
}

module.exports = {
    create,
    list,
    getUser,
    login,
    loginRequired,
    profile,
    update,
    uploadAvatar,
}