const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;


async function dbConnect() {
    try {
      await mongoose.connect(DB_URI, {});
      console.log('Conexión a la base de datos exitosa');
    } catch (error) {
      console.error('Error al conectar a la base de datos', error);
    }
  }

module.exports = { dbConnect };
