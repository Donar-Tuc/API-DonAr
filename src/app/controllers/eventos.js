const Eventos = require("../models/eventos");
const Fundaciones = require("../models/fundaciones");

const isAdminFunction = (user) => {
    return user.admin;
}

const getEventos = async (req, res, next) => {
    try {
        const listAll = await Eventos.find({});
        res.send({ list: listAll });
    } catch (error) {
        next(error);
    }
};

const getEvento = async (req, res, next) => {
    try {
        const id = req.params.id;
        const findOne = await Eventos.findById(id);
        res.send({ document: findOne });
    } catch (error) {
        next(error);
    }
};

const getFundacionEventos = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const eventos = await Eventos.find({ fundacionOrganizadora: userId });

        if (!eventos) {
            return res.status(404).send({ message: "No events found for this organization." });
        }

        res.status(200).send({ list: eventos });
    } catch (error) {
        next(error);
    }
};

const createEvento = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const user = await Fundaciones.findById(userId);
        const isAdmin = isAdminFunction(user);

        let fundacionOrganizadora;

        if (req.body.idFundacion && isAdmin) {
            fundacionOrganizadora = await Fundaciones.findById(req.body.idFundacion);

            if (!fundacionOrganizadora) {
                return res.status(404).send({ message: "fundacionOrganizadora not found" });
            }
        } else if (!req.body.idFundacion && isAdmin) {

                return res.status(400).send({ message: "Provide an idFundacion" });
        } else {
                fundacionOrganizadora = user;
        }

        let logoUrl;
        const { 
            titulo, 
            descripcion, 
            fechaInicio, 
            fechaFin, 
            tituloEtiquetas
        } = req.body; 

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }
        
        const createOne = await Eventos.create({
            logo: logoUrl, 
            titulo, 
            descripcion, 
            fechaInicio, 
            fechaFin, 
            tituloEtiquetas,
            fundacionOrganizadora: fundacionOrganizadora._id
        });

        res.send({ created: createOne });
    } catch (error) {
        next(error);
    }
};

const updateEvento = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const eventoId = req.params.id;

        const evento = await Eventos.findById(eventoId);
        const user = await Fundaciones.findById(userId);
        const isAdmin = isAdminFunction(user);

        if(!evento){
            return res.status(400).send({ message: "Event not found"})
        }

        const { fundacionOrganizadora: fundacionOrganizadoraId } = evento;

        if (fundacionOrganizadoraId.toString() !== userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }

        let logoUrl;
        const { 
            titulo, 
            descripcion, 
            fechaInicio, 
            fechaFin, 
            tituloEtiquetas
        } = req.body;

        if (req.file) {
            logoUrl = `/upload/file/${req.file.id}`;
        }

        const updateOne = await Eventos.findByIdAndUpdate(eventoId, {
            logo: logoUrl, 
            titulo, 
            descripcion, 
            fechaInicio, 
            fechaFin, 
            tituloEtiquetas
        }, { new: true });

        res.send({ updated: updateOne });
    } catch (error) {
        next(error);
    }
};

const deleteEvento = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const eventoId = req.params.id;

        const user = await Fundaciones.findById(userId);
        const isAdmin = isAdminFunction(user);

        const evento = await Eventos.findById(eventoId);

        if(!evento){
            return res.status(400).send({ message: "Event not found"})
        }
        const { fundacionOrganizadora: fundacionOrganizadoraId } = evento;

        if (fundacionOrganizadoraId.toString() !== userId && !isAdmin) {
            return res.status(400).send({ message: "User credentials don't match" });
        }
        
        const deleteOne = await Eventos.findByIdAndDelete(eventoId);
        res.send({ deleted: deleteOne });
    } catch (error) {
        next(error);
    }
};

module.exports = { getEventos, getEvento, getFundacionEventos, createEvento, updateEvento, deleteEvento };
