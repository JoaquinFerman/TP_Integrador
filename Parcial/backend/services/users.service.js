const { User } = require('../models');
const bcrypt = require('bcrypt');

const saltRounds = 10

const usersGet = async function (whereClauses = {}) {
    return await User.findAndCountAll({
        where: whereClauses,
    });
}

const userPost = async function (name, password) {
    try {
        password = await bcrypt.hash(password, saltRounds)
        return await User.create({ name, password });
    } catch (err) {
        throw new Error('Error en el servidor');
    }
}

const userUpdate = async function (id, name) {
    try {
        const [updatedRows] = await User.update(
        { name },
        { where: { id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        return updatedRows;
    } catch (err) {
        throw new Error('Error en el servidor');
    }
}

const userDelete = async function (id) {
    try {
        const deletedRows = await User.destroy({ where: { id } });

        if (deletedRows === 0) {
            throw new Error('Usuario no encontrado');
        }

        return true
    } catch (err) {
        throw new Error(err);
    }
}

module.exports = {
    usersGet,
    userPost,
    userUpdate,
    userDelete
}