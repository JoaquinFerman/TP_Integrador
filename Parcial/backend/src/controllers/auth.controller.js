const bcrypt = require('bcrypt');
const { User } = require('../models');
const { usersGet } = require('../services/users.service');

const userLogin = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const users = (await usersGet({name})).rows;
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
        return res.status(200).redirect('./admin/productos/todas');
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
    userLogin
}