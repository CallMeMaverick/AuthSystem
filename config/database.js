const mongoose = require("mongoose");
require("dotenv").config({ path: "../" });

const connectDB = async (connectionString) => {
    try {
        mongoose.connect(connectionString);
        console.log("Successfully connected to DB");
    } catch (exception) {
        throw exception;
    }
}

module.exports = connectDB;