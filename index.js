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

app.listen(PORT, () => {
    dbConnect();
    console.log("Servidor escuchando en el puerto " + PORT);
});