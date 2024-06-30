const fundacionModel = require("../models/fundaciones");

const getFundaciones = async (req, res, next) => {
    try {
        const listAll = await fundacionModel.find({})
        res.send({ list: listAll });
    }
    catch (error) {
        next(error);
    }
}

const getFundacionesPorEtiqueta = async (req, res, next) => {
    try {
        const etiqueta = req.query.etiqueta;

        const fundaciones = await fundacionModel.find({
            tituloEtiquetas: { $in: etiqueta }
        });
        res.send({ list: fundaciones });
    } catch (error) {
        next(new Error("Error al obtener las fundaciones por etiqueta: " + error.message));
    }
}


module.exports = { getFundaciones, getFundacionesPorEtiqueta }

