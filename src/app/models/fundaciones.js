const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const fundacionesSchema = new mongoose.Schema({
    logo: String,
    titulo: String,
    horario: String,
    direccion: String,
    telefono: String,
    sitioWeb: String,
    mapaBoton: String,
    mapa: String,
    descripcion: String,
    tituloEtiquetas: [String],
    //password: {
    //    type: String,
    //    required: true
    //},
    userName: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true,
    versionKey: false
});

//Encriptar password antes de crear
fundacionesSchema.pre("save", async function (next) {

    const fundacion = this;

    if (!fundacion.isModified('password')) return next();

    try
    {
        const hashedPassword = await bcrypt.hash(fundacion.password, 10);
        fundacion.password = hashedPassword;
        next();
    }
    catch(error)
    {
        next(error);
    }
})

//Encriptar password antes de actualizar
fundacionesSchema.pre('findOneAndUpdate', async function (next) {
    const fundacion = this.getUpdate();
    
    if (fundacion.password) {
        try {
            const hashedPassword = await bcrypt.hash(fundacion.password, 10);
            this.setUpdate({ ...fundacion, password: hashedPassword });
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});



const Fundaciones = mongoose.model('Fundaciones', fundacionesSchema, "Fundaciones");

module.exports = Fundaciones;
