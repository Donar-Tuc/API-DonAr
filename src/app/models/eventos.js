const mongoose = require('mongoose');

const eventosSchema = new mongoose.Schema({
    titulo: String,
    fechaInicio: Date,
    fechaFin: Date, // Considerando que quieras almacenar fecha y hora juntas
    descripcion: String,
    tituloEtiquetas: [String],
    fundacionOrganizadora: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundacion' },
},
{
    timestamps: true,
    versionKey: false
});

const Eventos = mongoose.model('Eventos', eventosSchema, "Eventos");

module.exports = Eventos;