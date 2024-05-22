require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dbConnect } = require("./src/config/mongo");
const { handleError } = require("./src/app/middleware/handleError");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", require("./src/app/routes"));
app.use(handleError);

const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        await dbConnect();
        console.log("**** CONEXION ESTABLECIDA ****");

        const server = app.listen(PORT, () => {
            console.log("Servidor escuchando en el puerto " + PORT);
        });

        server.timeout = 30000; // Aumenta el tiempo de espera a 30 segundos
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1);
    }
}

if (process.env.NODE_ENV !== 'production') {
    startServer();
}

module.exports = app;
