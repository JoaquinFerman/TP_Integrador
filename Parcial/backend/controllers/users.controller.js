const { User } = require('../models');
const bcrypt = require('bcrypt');
const { usersGet, userPost, userUpdate, userDelete } = require('../services/users.service');

const getUserHomePage = (req, res) => {
  return res.render('index');
};

const getUserPage = async (req, res) => {
  try {
    const users = await User.findAll();
    res.render('users', { users });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await usersGet()
    res.status(200).json({ users });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const postUser = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    res.status(200).json({ message : 'Nuevo usuario creado exitosamente',id : (await userPost(name, password)).id})
  } catch (err) {
    console.error('Error al insertar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    userUpdate(id, name)
    res.status(200).json({ message : 'Usuario actualizado exitosamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await userDelete(id)
    return res.status(200).json({ message : 'Usuario eliminado existosamente' })

  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: err.message });
  }
};

const userLogin = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const users = await User.findAll({ where: { name } });
    if (users.length === 0) {
      if (req.accepts('html')){
        return res.status(401).render('index', { error: 'Usuario o contraseña incorrectos' })
      } else {
        return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }
    }

    for (const user of users) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(200).redirect('./productos/todas');
      }
    }

    if (req.accepts('html')){
      return res.status(401).render('index', { error: 'Usuario o contraseña incorrectos' })
    } else {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (err) {
    console.error('Error al buscar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


module.exports = {
  getUsers,
  getUserHomePage,
  getUserPage,
  postUser,
  updateUser,
  deleteUser,
  userLogin,
};
