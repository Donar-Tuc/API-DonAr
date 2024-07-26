const mongoose = require('mongoose');

const estadisticasSchema = new mongoose.Schema({
    numeroDeFundacionesAsociadas: { type: Number, default: 0 },
    cantidadDeEventosDifundidos: { type: Number, default: 0 },
    transaccionesRealizadasPorMercadoPago: { type: Number, default: 0 },
},
{
    timestamps: true,
    versionKey: false
});

const Estadisticas = mongoose.model('Estadisticas', estadisticasSchema, "Estadisticas");

module.exports = Estadisticas;
