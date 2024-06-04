const mongoose = require("mongoose");

const fundacionesSchema = new mongoose.Schema({
    logo: String,
    titulo: String,
    horario: String,
    direccion: String,
    telefono: String,
    sitioWeb: String,
    mapaBoton: String,
    email: {
        type: String,
        unique: true, // Este campo debe ser único
        required: true
    },
    mapa: String,
    descripcion: String,
    tituloEtiquetas: [String],
    //password: {
    //    type: String,
    //    required: true
    //},
},
{
    timestamps: true,
    versionKey: false
});

const Fundaciones = mongoose.model('Fundaciones', fundacionesSchema, "Fundaciones");

module.exports = Fundaciones;
