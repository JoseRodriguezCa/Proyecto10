const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("conectado a la bbdd");
  } catch (error) {
    console.log("no se pudo conectar a la bbdd");
  }
};

module.exports = { connectDB };
