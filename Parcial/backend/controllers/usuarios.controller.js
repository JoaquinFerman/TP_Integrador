
const getUsuarioHomePage = function(req, res) {
    return res.render('index')
}

const registrarUsuario = function(req, res) {
    const { nombre, mail } = req.body;
    console.log(`Nuevo usuario: ${nombre}, ${mail}`);
    return res.send('Usuario registrado con éxito');
}

module.exports = {
    getUsuarioHomePage,
    registrarUsuario
}