const fundacionModel = require("../models/fundaciones");

const getFundaciones = async (req, res, next) => {
    try 
    {
        const listAll = await fundacionModel.find({})
        res.send({ list: listAll });
    }    
    catch (error) 
    {
        next(error);
    }
}

const getFundacion = async (req, res, next) => {
    try 
    {
        const id = req.params.id;
        console.log("Find by id: ", id);
        const findOne = await fundacionModel.findById(id);
        res.send({ document: findOne });
    } 
    catch (error) 
    {
        next(error);
    }
}

const createFundacion = async (req, res, next) => {
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
            email,
            password
        } = req.body; 

        const createOne = await fundacionModel.create({ 
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
}


const updateFundacion = async (req, res, next) => {
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

        const updateOne = await fundacionModel.findByIdAndUpdate(id, { 
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
}


const deleteFundacion = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log("Delete by id: ", id);
        const deleteOne = await fundacionModel.findByIdAndDelete(id);
        res.send({ deleted: deleteOne });
        
    }    
    catch (error) 
    {
        next(error);
    }
    
}

module.exports = { getFundaciones, getFundacion, createFundacion, updateFundacion, deleteFundacion }

