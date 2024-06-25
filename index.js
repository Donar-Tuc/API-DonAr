/* require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./src/config/mongo");
const { handleError } = require("./src/app/middleware/handleError");
const os = require("os");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", require("./src/app/routes"));
app.use('/uploads', express.static(os.tmpdir()));
app.use(handleError);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        console.log("DB_URI:", process.env.DB_URI); // Log para verificar DB_URI
        if (!process.env.DB_URI) {
            throw new Error("DB_URI no está definido en las variables de entorno");
        }
        await dbConnect();
        console.log("Conexión a la base de datos establecida");

        app.listen(PORT, () => {
            console.log("Servidor escuchando en el puerto " + PORT);
        });
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
    }
};

startServer();

module.exports = app;
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnect } = require('./src/config/mongo');
const { handleError } = require('./src/app/middleware/handleError');
const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');
const { upload, uploadFileToGridFS } = require('./src/app/middleware/upload'); // Asegúrate de usar la ruta correcta a tu archivo uploadConfig.js

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', require('./src/app/routes'));
app.use('/upload/file/:id', express.static('uploads/logosFundaciones')); // Ajusta la ruta según donde deseas servir los archivos estáticos

app.use(handleError);

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        console.log('DB_URI:', process.env.DB_URI); // Log para verificar DB_URI
        if (!process.env.DB_URI) {
            throw new Error('DB_URI no está definido en las variables de entorno');
        }
        await dbConnect();
        console.log('Conexión a la base de datos establecida');

        app.listen(PORT, () => {
            console.log('Servidor escuchando en el puerto ' + PORT);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Salir del proceso si no se puede conectar a la base de datos
    }
};

startServer();

module.exports = app;


