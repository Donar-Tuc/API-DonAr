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

const getFundacionesPorEtiquetas = async (req, res, next) => {
    try {
        const necesidades = req.query.necesidades; // Suponiendo que las necesidades se pasen como parámetro de consulta en la URL
        // const necesidades = req.params.necesidades; // alternativa
        const fundaciones = await fundacionModel.find({
            necesidadesActuales: { $in: necesidades }
        });
        res.send({ list: fundaciones });
    } catch (error) {
        next(new Error("Error al obtener las fundaciones por necesidades: " + error.message));
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
            //password
        } = req.body; 

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
        const 
        { 
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
        } = req.body; 

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

module.exports = { getFundaciones, getFundacionesPorEtiquetas, getFundacion, createFundacion, updateFundacion, deleteFundacion }

