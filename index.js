const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const dotenv = require('dotenv');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');

//Set up Swagger
const swaggerDocument = YAML.load('./routes/swagger/swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Import Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

//dotenv.config();

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT,
    { 
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => {
        console.log('Connected to db!');
    }
);

//Middleware
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(3000, () => {
    console.log('Up and running');
});