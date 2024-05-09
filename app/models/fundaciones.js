const mongoose = require("mongoose");

const fundacionesSchema = new mongoose.Schema({
    nombre: String,
    descripcion: String,
    direccion: String,
    contacto: String,
    logo: String,
    necesidadesActuales: [String],
    informacionPago: String,
    email: {
        type: String,
        unique: true // Este campo debe ser único
    }
},
{
    timestamps: true,
    versionKey: false
});

const Fundaciones = mongoose.model('Fundaciones', fundacionesSchema, "Fundaciones");

module.exports = Fundaciones;
