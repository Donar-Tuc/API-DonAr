const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');

const getFileFromGridFS = async (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    try {

        if (!mongoose.connection.db) {
            throw new Error('No se pudo establecer la conexión a la base de datos');
        }

        const db = mongoose.connection.db;

        const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

        const fileId = new ObjectId(req.params.id);

        const files = await bucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).send('No se encontró el archivo');
        }


        res.set('Content-Type', files[0].contentType);
        res.set('Content-Disposition', `inline; filename="${files[0].filename}"`);

        const downloadStream = bucket.openDownloadStream(fileId);

        downloadStream.on('error', (error) => {
            console.error('Error al abrir flujo de descarga:', error);
            res.status(500).send({ error: 'Error al abrir flujo de descarga' });
            next(error);
        });

        downloadStream.on('end', () => {
            res.end();
        });

        downloadStream.pipe(res);

    } catch (error) {
        console.error('Error en getFileFromGridFS:', error);
        res.status(500).send({ error: 'Error en getFileFromGridFS' });
        next(error);
    }
};


module.exports = { getFileFromGridFS };
