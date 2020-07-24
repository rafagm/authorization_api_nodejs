const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//Importer Routes
const authRoute = require('./routes/auth');

dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log("Connected to db!");
    }
);

//Middleware
app.use(express.json());
//Route Middlewares
app.use("/api/user", authRoute);

app.listen(3000, () => {
    console.log("Up and running");
});