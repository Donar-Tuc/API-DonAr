const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;

let cachedDb = null;

async function dbConnect() {
    if (cachedDb) {
        console.log("Usando conexión de base de datos en caché");
        return cachedDb;
    }

    if (!DB_URI) {
        throw new Error("DB_URI no está definido en las variables de entorno");
    }

    try {
        console.log("Intentando conectar a la base de datos...");
        const connection = await mongoose.connect(DB_URI, 
            {  
                useNewUrlParser: true,
                useUnifiedTopology: true,
        });
        console.log("Conexión a la base de datos exitosa");
        cachedDb = connection;
        return connection;
    } catch (error) {
        console.error("Error al conectar a la base de datos", error);
        throw error;
    }
}

module.exports = { dbConnect };
