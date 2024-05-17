const eventoModel = require("../models/eventos");

const getEventos = async (req, res, next) => {
    try 
    {
        const listAll = await eventoModel.find({})
        res.send({ list: listAll });
    } 
    catch (error) 
    {
        next(error);
    }
};


const getEvento = async (req, res, next) => {
    try 
    {
        const id = req.params.id;
        console.log("Find by id: ", id);
        const findOne = await eventoModel.findById(id);
        res.send({ document: findOne });
    } 
    catch (error) 
    {
        next(error);
    }    
};


const createEvento = async (req, res, next) => {
    try 
    {
        const 
        { 
            nombre, 
            descripcion, 
            direccion, 
            contacto, 
            logo, 
            necesidadesActuales,
            informacionPago,
            email
        } = req.body; 

        const createOne = await eventoModel.create({ 
            nombre, 
            descripcion, 
            direccion, 
            contacto, 
            logo, 
            necesidadesActuales,
            informacionPago,
            email
        });

        res.send({ created: createOne });
        
    } 
    catch (error) 
    {
        next(error);
    }
};


const updateEvento = async (req, res, next) => {
    try 
    {
        const id = req.params.id;
        console.log("Update by id: ", id);
        const 
        { 
            nombre, 
            descripcion, 
            direccion, 
            contacto, 
            logo, 
            necesidadesActuales,
            informacionPago,
            email
        } = req.body; 

        const updateOne = await eventoModel.findByIdAndUpdate(id, { 
            nombre, 
            descripcion, 
            direccion, 
            contacto, 
            logo, 
            necesidadesActuales,
            informacionPago,
            email
        }, { new: true });

        res.send({ updated: updateOne });

    } 
    catch (error) 
    {
        next(error);
    }
};


const deleteEvento = async (req, res, next) => {
    try 
    {
        const id = req.params.id;
        console.log("Delete by id: ", id);
        const deleteOne = await eventoModel.findByIdAndDelete(id);
        res.send({ deleted: deleteOne });
        
    } 
    catch (error) 
    {
        next(error);
    }
};

module.exports = { getEventos, getEvento, createEvento, updateEvento, deleteEvento };

