const fundacionModel = require("../models/fundaciones");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const isAdminFunction = (user) => {
    return user.admin;
}

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

const getFundaciones = async (req, res, next) => {
    try {
        const listAll = await fundacionModel.find({
            $or: [
                { admin: { $exists: false } },
                { admin: false }
            ]
        })
        res.send({ list: listAll });
    }
    catch (error) {
        next(error);
    }
}

const getFundacionesPorEtiqueta = async (req, res, next) => {
    try {
        const etiqueta = req.query.etiqueta;

        const fundaciones = await fundacionModel.find({
            tituloEtiquetas: { $in: etiqueta },
            $or: [
                { admin: { $exists: false } },
                { admin: false }
            ]
        });
        res.send({ list: fundaciones });
    } catch (error) {
        next(new Error("Error al obtener las fundaciones por etiqueta: " + error.message));
    }
}

const getFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const findOne = await fundacionModel.findById(id);
        res.send({ document: findOne });
    }
    catch (error) {
        next(error);
    }
}

const updateFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;
        const user = await fundacionModel.findById(userId);
        const isAdmin = isAdminFunction(user);

        if (id != userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }

        let logoUrl;
        let etiquetasArray = []; // Definir etiquetasArray aquí
        
        const {
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            linkMercadoPago,
            latitud,
            longitud,
            tituloEtiquetas,
        } = req.body;

        if (tituloEtiquetas) {
            etiquetasArray = Array.isArray(tituloEtiquetas) 
                ? tituloEtiquetas 
                : tituloEtiquetas.split(',').map(tag => tag.trim());
            console.log("Etiquetas recibidas:", etiquetasArray); // Log de etiquetas recibidas
            
            if (!etiquetasArray.every(tag => etiquetasPermitidas.includes(tag))) {
                return res.status(400).send({ message: "One or more tags are not allowed" });
            }
            if (etiquetasArray.includes("Donaciones monetarias") && !linkMercadoPago && !user.linkMercadoPago) {
                return res.status(400).send({ message: "Link Mercado Pago is mandatory when the 'Donaciones monetarias' tag is present" });
            }
        }

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }

        const updateOne = await fundacionModel.findByIdAndUpdate(id, {
            logo: logoUrl,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            linkMercadoPago,
            latitud,
            longitud,
            tituloEtiquetas: etiquetasArray 
        }, { new: true });

        res.send({ updated: updateOne });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).send({ message: `Duplicate value for ${field}` });
        }
        next(error);
    }
}




const loginFundacion = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Please provide email and password to proceed." });
        }

        const fundacion = await fundacionModel.findOne({ email: email });

        if (!fundacion) {
            console.log("Fundación no encontrada con el email:", email);
            return res.status(400).send({ message: "Please provide valid credentials." });
        }

        console.log("Fundación encontrada:", fundacion);

        const passwordMatch = await bcrypt.compare(password, fundacion.password);
        console.log("Comparación de contraseña:", passwordMatch);

        if (!passwordMatch) {
            return res.status(400).send({ message: "Please provide valid credentials." });
        }

        const token = jwt.sign({ userId: fundacion._id }, process.env.JWT_PASSWORD, { expiresIn: "1h" });

        res.send({
            token: token,
            userId: fundacion._id
        });
    } catch (error) {
        next(error);
    }
};


const registerFundacion = async (req, res, next) => {
    try {
        let logoUrl;
        const {
            email,
            password,

            admin,

            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            linkMercadoPago,
            latitud,
            longitud,
            tituloEtiquetas,
        } = req.body;

        
        const existingUser = await fundacionModel.findOne({ email: email });
        
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).send({ message: "Email already exists." });
            }
        }

        if (!tituloEtiquetas) {
            return res.status(400).send({ message: "Tags needed." });
        }
        const etiquetasArray = Array.isArray(tituloEtiquetas) ? tituloEtiquetas : [tituloEtiquetas];
        
        if (!etiquetasArray.every(tag => etiquetasPermitidas.includes(tag))) {
            return res.status(400).send({ message: "One or more tags are not allowed" });
        }
        
        if (etiquetasArray.includes("Donaciones monetarias") && !linkMercadoPago) {
            return res.status(400).send({ message: "Link ​​Mercado Pago is mandatory when the 'Donaciones monetarias' tag is present" });
        }
        
        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }

        const register = await fundacionModel.create({
            email,
            password,

            admin,

            logo: logoUrl,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            linkMercadoPago,
            latitud,
            longitud,
            tituloEtiquetas
        });

        res.send({ "register success": register });

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]; // Obtén el campo que causó el error
            return res.status(400).send({ message: `Duplicate value for ${field}` });
        }
        next(error);
    }
}

const updateAccountFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const user = await fundacionModel.findById(userId);
        const isAdmin = isAdminFunction(user);

        if (id != userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }

        const { password: oldPassword, newPassword, email } = req.body;

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            res.status(400).send({ message: "User password is incorrect." });
        }
        const passwordChanged = await fundacionModel.findByIdAndUpdate(id,
            {
                password: newPassword,
                email: email
            },
            { new: true }
        );

        if (passwordChanged) {
            res.send({ message: 'Your account has been updated successfully.' })
        } else {
            res.status(500).send({ message: "Error while trying to change user's credentials." })
        }
    }
    catch (error) {
        next(error);
    }
}


const deleteFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const user = await fundacionModel.findById(userId);
        const isAdmin = isAdminFunction(user);


        if (id != userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }

        const { password } = req.body;

        const passwordMatch = isAdmin ? true : await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            res.status(400).send({ message: "Password is incorrect." });
        }

        const deleteOne = await fundacionModel.findByIdAndDelete(id);

        if (deleteOne) {
            res.send({ deleted: deleteOne });
        } else {
            res.status(404).send({ message: "Fundacion not found." });
        }
    }
    catch (error) {
        next(error);
    }
}



module.exports = { getFundaciones, getFundacionesPorEtiqueta, getFundacion, updateFundacion, deleteFundacion, loginFundacion, registerFundacion, updateAccountFundacion }

