const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();


const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;
const {jwtAuthMiddleware}=require('./jwt');


const UserRoutes = require('./Routes/UserRoutes');
app.use('/user', UserRoutes);  // Important
const CandidateRoutes = require('./Routes/CandidateRoutes');
app.use('/candidate', CandidateRoutes);  // Important


app.listen(PORT, () => {
    console.log(`Server is running on port number ${PORT}`);
});