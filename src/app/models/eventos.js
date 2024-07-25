const mongoose = require('mongoose');

const eventosSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    fechaHora: Date, // Considerando que quieras almacenar fecha y hora juntas
    ubicacion: String,
    fundacionOrganizadora: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundacion' },
    tipoDeEvento: String,
},
{
    timestamps: true,
    versionKey: false
});

const Eventos = mongoose.model('Eventos', eventosSchema, "Eventos");

module.exports = Eventos;