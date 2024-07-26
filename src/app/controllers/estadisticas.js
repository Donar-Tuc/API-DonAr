const Estadisticas = require("../models/estadisticas");
const Fundaciones = require("../models/fundaciones");
const Eventos = require("../models/eventos");

const getEstadisticas = async (req, res, next) => {
    try {
        const numeroDeFundacionesAsociadas = await Fundaciones.countDocuments();
        const cantidadDeEventosDifundidos = await Eventos.countDocuments();

        let estadisticas = await Estadisticas.findOne();
        
        if (!estadisticas) {
            estadisticas = await Estadisticas.create({
                numeroDeFundacionesAsociadas,
                cantidadDeEventosDifundidos,
                transaccionesRealizadasPorMercadoPago: 0,
            });
        } else {
            estadisticas.numeroDeFundacionesAsociadas = numeroDeFundacionesAsociadas;
            estadisticas.cantidadDeEventosDifundidos = cantidadDeEventosDifundidos;
            await estadisticas.save();
        }

        res.send({ estadisticas });

    } catch (error) {
        next(error);
    }
};

module.exports = { getEstadisticas };
