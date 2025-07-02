const { User } = require('../models');
const bcrypt = require('bcrypt');

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
    const users = await User.findAll();
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
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({ name, password: hashedPassword });
    res.status(201).json({ message: 'Usuario creado', id: newUser.id });
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
    const [updatedRows] = await User.update(
      { name },
      { where: { id } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(204).json({ message: 'Usuario actualizado' });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await Usuario.destroy({ where: { id } });

    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(204).json({ message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
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
