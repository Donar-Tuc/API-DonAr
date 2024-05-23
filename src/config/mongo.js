const mongoose = require("mongoose");
const DB_URI = process.env.DB_URI;
let cachedDb = null;


async function dbConnect() {
    if (cachedDb) {
        return cachedDb;
    }
    try {
      var connection = await mongoose.connect(DB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('Conexión a la base de datos exitosa');
      cachedDb = connection;
      return connection;
    } catch (error) {
      console.error('Error al conectar a la base de datos', error);
    }
  }

module.exports = { dbConnect };
