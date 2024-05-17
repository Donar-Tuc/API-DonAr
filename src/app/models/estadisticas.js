const mongoose = require('mongoose');

const estadisticasSchema = new mongoose.Schema({
    numeroDeFundacionesAsociadas: Number,
    cantidadDeEventosDifundidos: Number,
    transaccionesRealizadasPorMercadoPago: Number,
},
{
    timestamps: true,
    versionKey: false
});

const Estadisticas = mongoose.model('Estadisticas', estadisticasSchema, "Estadisticas");

module.exports = Estadisticas;
