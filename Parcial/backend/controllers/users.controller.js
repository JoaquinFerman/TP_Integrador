const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

const getUsuarioHomePage = (req, res) => {
  return res.render('index');
};

const getUsuariosPage = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('usuarios', { usuarios });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.status(200).json({ usuarios });
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const registrarUsuario = async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const nuevoUsuario = await Usuario.create({ nombre, password: hashedPassword });
    res.status(201).json({ message: 'Usuario creado', id: nuevoUsuario.id });
  } catch (err) {
    console.error('Error al insertar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, password } = req.body;

  if (!nombre || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [updatedRows] = await Usuario.update(
      { nombre, password: hashedPassword },
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

const deleteUsuario = async (req, res) => {
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

const loginUsuario = async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const usuarios = await Usuario.findAll({ where: { nombre } });
    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    for (const usuario of usuarios) {
      const isMatch = await bcrypt.compare(password, usuario.password);
      if (isMatch) {
        return res.status(200).json({
          message: 'Inicio de sesión exitoso',
          usuario: { id: usuario.id, nombre: usuario.nombre }
        });
      }
    }

    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  } catch (err) {
    console.error('Error al buscar usuario:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};


module.exports = {
  getUsuarios,
  getUsuarioHomePage,
  getUsuariosPage,
  registrarUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
};
