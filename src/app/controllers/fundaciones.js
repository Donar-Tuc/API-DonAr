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
        let logo;
        const 
        { 
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            email,
            mapa,
            descripcion,
            tituloEtiquetas
            //password
        } = req.body; 
        if (req.file) {
            logo = req.file.path;
        }

        const createOne = await fundacionModel.create({ 
            logo,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            email,
            mapa,
            descripcion,
            tituloEtiquetas
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
        let logo;
        const 
        { 
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            email,
            mapa,
            descripcion,
            tituloEtiquetas
        } = req.body; 
        if (req.file) {
            logo = req.file.path;
        }
        const updateOne = await fundacionModel.findByIdAndUpdate(id, { 
            logo,
            titulo,
            horario,
            direccion,
            telefono,
            sitioWeb,
            mapaBoton,
            email,
            mapa,
            descripcion,
            tituloEtiquetas
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

module.exports = { getFundaciones, getFundacionesPorEtiqueta, getFundacion, createFundacion, updateFundacion, deleteFundacion }

