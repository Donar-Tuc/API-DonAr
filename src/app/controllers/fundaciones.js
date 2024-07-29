const fundacionModel = require("../models/fundaciones");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const isAdminFunction = (user) => {
    return user.admin;
}

const getFundaciones = async (req, res, next) => {
    try {
        const listAll = await fundacionModel.find({
            $or: [
                { admin: { $exists: false } },
                { admin: false }
            ]})
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
        const {
            userName,
            email,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            tituloEtiquetas,
        } = req.body;

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }

        const updateOne = await fundacionModel.findByIdAndUpdate(id, {
            userName,
            email,
            logo: logoUrl,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            tituloEtiquetas
        }, { new: true });

        res.send({ updated: updateOne });

    } catch (error) {
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
            userName,
            email,
            password,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            tituloEtiquetas,
            admin
        } = req.body;

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }
        
        const register = await fundacionModel.create({
            userName,
            email,
            password,
            logo: logoUrl,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            mapa,
            descripcion,
            tituloEtiquetas,
            admin
        });
        
        res.send({ "register success": register });
        
    } catch (error) {
        next(error);
    }
}

const changePasswordFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.userId;

        const user = await fundacionModel.findById(userId);
        const isAdmin = isAdminFunction(user);
        
        if (id != userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }
        
        const { password: oldPassword, newPassword } = req.body;
        
        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            res.status(400).send({ message: "Old password is incorrect." });
        }
        const passwordChanged = await fundacionModel.findByIdAndUpdate(id, 
            { password: newPassword },
            { new: true }
        );
        
        if(passwordChanged) {
            res.send({ message: 'Your password has been updated successfully.' })
        } else {
            res.status(500).send({ message: "Error al intentar cambiar la contraseña" })
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

        res.send({ deleted: deleteOne });
    }
    catch (error) {
        next(error);
    }
}



module.exports = { getFundaciones, getFundacionesPorEtiqueta, getFundacion, updateFundacion, deleteFundacion, loginFundacion, registerFundacion, changePasswordFundacion }

