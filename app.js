require('dotenv').config();

const express =  require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const todoApp = require('./modals/app-modals.js');
const taskRoutes = require('./routes/taskRoutes.js');
const mongoURI = process.env.MONGO_URI;
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors')
const { mongoClient } = require('mongodb');

//cors
app.use(cors());

//middleware 

app.use(express.static('./public'))     

app.use(express.json())


app.use(express.urlencoded({extended: false}))

//define routes


app.use('/',taskRoutes)                                 
  


// mongoDB connection

mongoose.connect(mongoURI)
    .then(() => {
        console.log('backend connected');
        app.listen(PORT,() => {
            console.log(`server is listening PORT: ${PORT}`);
            })
    })
    .catch((err) => {
        console.log(`Error : ${err}`)
    })





    // remember the password