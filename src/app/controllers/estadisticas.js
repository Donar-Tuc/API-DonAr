const estadisticasModel = require("../models/estadisticas");
const fundacionModel = require("../models/fundaciones");
const eventoModel = require("../models/eventos");

const getEstadisticas = async (req, res, next) => {
    try 
    {
        const numeroDeFundacionesAsociadas = await fundacionModel.countDocuments();
        const cantidadDeEventosDifundidos = await eventoModel.countDocuments();

        let estadisticas = await estadisticasModel.findOne();
        
        if(!estadisticas)
        {
            await estadisticasModel.create()
        }

        estadisticas = await estadisticasModel.findOneAndUpdate({}, {
            numeroDeFundacionesAsociadas,
            cantidadDeEventosDifundidos, 
        }, { new: true });

        res.send({ estadisticas: estadisticas });

    } 
    catch (error) 
    {
        next(error);
    }
};

module.exports = { getEstadisticas };