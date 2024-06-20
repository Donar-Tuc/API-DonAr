const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

const getFileFromGridFS = (req, res, next) => {
    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });
    const fileId = new mongoose.Types.ObjectId(req.params.id);

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

module.exports = { getFileFromGridFS };
