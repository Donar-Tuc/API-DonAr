/* const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require("mongodb");

const getFileFromGridFS = (req, res, next) => {
    const db = mongoose.connection.db;

    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });


    const fileId = ObjectId(req.params.id);

    bucket.find({ _id: fileId }).toArray((err, files) => {
        if (err) {
            return next(err);
        }

        if (!files || files.length === 0) {
            return res.status(404).send('No file found');
        }

        res.set('Content-Type', files[0].contentType);
        res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            next(error);
        });

        downloadStream.on('end', () => {
            res.end();
        });

        downloadStream.pipe(res);
    });
};

module.exports = { getFileFromGridFS }; */

const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');

// Suponiendo que ya tienes una conexión mongoose establecida
const db = mongoose.connection.db;
const bucket = new GridFSBucket(db, {
    bucketName: 'uploads' // Nombre del bucket donde se guardan los archivos
});

// Función para manejar la descarga de la imagen por su ID
const getFileFromGridFS = (req, res, next) => {
    const fileId = new ObjectId(req.params.id); // Obtener el ID del parámetro de la solicitud

    // Abrir un flujo de descarga para el archivo con el ID específico
    const downloadStream = bucket.openDownloadStream(fileId);

    // Configurar encabezados de respuesta adecuados (Content-Type y Content-Disposition)
    downloadStream.on('file', (file) => {
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    });

    // Manejar errores y finalización del flujo de descarga
    downloadStream.on('error', (error) => {
        console.error('Error al descargar archivo:', error);
        res.status(404).send('Archivo no encontrado');
    });

    downloadStream.on('end', () => {
        res.end();
    });

    // Transmitir el contenido del archivo al objeto de respuesta (res) de Express
    downloadStream.pipe(res);
};

module.exports = { getFileFromGridFS };

