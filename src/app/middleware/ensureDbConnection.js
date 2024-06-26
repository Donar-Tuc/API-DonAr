const mongoose = require('mongoose');

const ensureDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) { // 1 significa 'connected'
        return res.status(500).send({ error: 'No se pudo conectar a la base de datos' });
    }
    next();
};

module.exports =  { ensureDbConnection }