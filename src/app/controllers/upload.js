const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');

const getFileFromGridFS = (req, res, next) => {
    console.log('Iniciando getFileFromGridFS');
    
    const db = mongoose.connection.db;
    console.log('Conexión a la base de datos establecida');

    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log('Bucket de GridFS creado');

    const fileId = ObjectId(req.params.id);
    console.log('ID del archivo:', fileId);

    bucket.find({ _id: fileId }).toArray((err, files) => {
        if (err) {
            console.error('Error al buscar archivos en GridFS:', err);
            return next(err);
        }

        if (!files || files.length === 0) {
            console.log('Archivo no encontrado en GridFS');
            return res.status(404).send('No file found');
        }

        console.log('Archivo encontrado en GridFS:', files[0]);

        res.set('Content-Type', files[0].contentType);
        res.set('Content-Disposition', `attachment; filename="${files[0].filename}"`);

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            console.error('Error al abrir flujo de descarga:', error);
            next(error);
        });

        downloadStream.on('end', () => {
            console.log('Descarga del archivo completada');
            res.end();
        });

        downloadStream.pipe(res);
    });
};

module.exports = { getFileFromGridFS };
