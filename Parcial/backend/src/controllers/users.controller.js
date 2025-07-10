const { usersGet, userPost, userUpdate, userDelete } = require('../services/users.service');
const { User } = require('../models');

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


module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser
};
