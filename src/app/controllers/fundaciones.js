const fundacionModel = require("../models/fundaciones");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getFundaciones = async (req, res, next) => {
    try {
        const listAll = await fundacionModel.find({})
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
            tituloEtiquetas: { $in: etiqueta }
        });
        res.send({ list: fundaciones });
    } catch (error) {
        next(new Error("Error al obtener las fundaciones por etiqueta: " + error.message));
    }
}

const getFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("Find by id: ", id);
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

        if(id != userId) {
            return res.status(400).send({ message: "User credentials don't match" });
        }


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
        } = req.body;

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }

        const updateOne = await fundacionModel.findByIdAndUpdate(id, {
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
            tituloEtiquetas
        }, { new: true });

        res.send({ updated: updateOne });

    } catch (error) {
        next(error);
    }
}



const deleteFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("Delete by id: ", id);
        const deleteOne = await fundacionModel.findByIdAndDelete(id);
        res.send({ deleted: deleteOne });

    }
    catch (error) {
        next(error);
    }

}

const loginFundacion = async (req, res, next) => {
    try 
    {
        const { email, password } = req.body;

        if(!email || !password)
        {
            res.status(400).send({ message: "Please provide email and password to proceed." });
        }

        const user = await fundacionModel.findOne({ email: email });
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!user || !passwordMatch)
        {
            res.status(400).send({ message: "Please provide valid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_PASSWORD, { expiresIn: "1h" });

        res.send({ token: token });
    } 
    catch (error) 
    {
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
            tituloEtiquetas
        });

        res.send({ "register success": register });

    } catch (error) {
        next(error);
    }
}

module.exports = { getFundaciones, getFundacionesPorEtiqueta, getFundacion, updateFundacion, deleteFundacion, loginFundacion, registerFundacion }

