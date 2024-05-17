const express = require("express");
const router = express.Router();
const fs = require("fs");


const pathRouter = `${__dirname}`;

const removeExtension = (fileName) => {
    return fileName.split(".").shift(); 
}

fs.readdirSync(pathRouter).filter((file) => {
    const fileWithoutExtension = removeExtension(file);
    const skip = ["index"].includes(fileWithoutExtension);
    if(!skip)
    {
        router.use(`/${fileWithoutExtension}`, require(`./${fileWithoutExtension}`));
        console.log('CARGAR RUTA ---->', fileWithoutExtension)
    }
});


module.exports =  router;
