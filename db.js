const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL= process.env.MONGODB_URL_LOCAL;
//const mongoURL = process.env.MONGODB_URL 

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})





const db = mongoose.connection;

// Event listeners
db.on('connected', () => {
    console.log('MongoDB server connected');
});
db.on('error', (err) => {
    console.log('MongoDB connection error:', err);
});
db.on('disconnected', () => {
    console.log('MongoDB server disconnected');
});

module.exports = db;