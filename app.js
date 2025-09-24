const dotenv = require("dotenv");
dotenv.config();

const express =  require('express');
const mongoose = require('mongoose');



const taskRoutes = require('./routes/taskRoutes.js');
const authRoutes = require('./routes/authRoutes.js')

const userAuthMiddleware = require("./Middleware/userAuthMiddleware.js")
const guestAuthRoutes = require("./Middleware/guestAuthMiddleware.js")
const mongoURI = process.env.MONGO_URI;
const app = express();


const JWT_SECRET = process.env.SECRET_KEY;
const PORT = process.env.PORT || 5000;
const cors = require('cors')
// const { mongoClient } = require('mongodb');

//cors
app.use(cors());

//middleware 

app.use(express.static('./public'))     

app.use(express.json())


app.use(express.urlencoded({extended: false}))


//user specific routes


app.use("/api/auth/user",authRoutes);
app.use("/api/auth/guest", authRoutes);
app.use("/api", taskRoutes);


                           
  


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



