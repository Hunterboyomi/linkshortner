const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds timeout
        });
        console.log("Connected to MongoDB ...");
    } catch (err) {
        console.error('Error connecting to database: ', err);
        process.exit(1);
    }
};

module.exports = connectDB;
