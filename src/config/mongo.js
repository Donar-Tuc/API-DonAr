const mongoose = require("mongoose");

const dbConnect = () => 
{

    const DB_URI = process.env.DB_URI;
    mongoose.connect(DB_URI);

    mongoose.connection.on("connected", () => console.log("**** CONEXION ESTABLECIDA ****"));
    mongoose.connection.on("error", (err) => console.log("**** ERROR DE CONEXION ****", err));
}

module.exports = { dbConnect };