const mongoose = require('mongoose');

const etiquetasPermitidas = [
    "Donaciones monetarias",
    "Alimentos no perecederos",
    "Asistencia y voluntariados",
    "Vestimenta",
    "Juguetes",
    "Medicamentos",
    "Útiles escolares",
    "Elementos del hogar"
];

const eventosSchema = new mongoose.Schema({
    logo: String,
    titulo: String,
    fechaInicio: Date,
    fechaFin: Date, // Considerando que quieras almacenar fecha y hora juntas
    descripcion: String,
    tituloEtiquetas: {
        type: [String],
        validate: [
            {
                validator: function(array) {
                    // Usar un Set para verificar valores únicos
                    return new Set(array).size === array.length;
                },
                message: props => `${props.value} contiene valores duplicados`
            },
            {
                validator: function(array) {
                    // Verificar que todos los valores estén en la lista de etiquetasPermitidas
                    return array.every(value => etiquetasPermitidas.includes(value));
                },
                message: props => `${props.value} contiene un valor no permitido`
            }
        ]
    },
    fundacionOrganizadora: { type: mongoose.Schema.Types.ObjectId, ref: 'Fundacion' },
},
{
    timestamps: true,
    versionKey: false
});

const Eventos = mongoose.model('Eventos', eventosSchema, "Eventos");

module.exports = Eventos;
