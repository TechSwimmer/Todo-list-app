const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");  // use express-valid to validate user
const User = require("../modals/user-modal");

require('dotenv').config()


const JWT_SECRET = process.env.SECRET_KEY;



// const router = express.Router();


// 🔹 Middleware to Verify JWT Token
const authMiddleware = (req, res, next) => {

  const token = req.header("Authorization")?.split(" ")[1];
  const userID = req.header("userID") || req.header("userid");
  

  console.log("token:", token);
  console.log("userID:", userID);
  
  
  if (!token) {return res.status(401).json({ msg: "Unauthorized: No token or user ID provided" })};

  if(token) {
    try{
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      console.log("Decoded Token:", decoded);
      return next();
    }
    catch(err) {
      return res.status(403).json({ msg: "Invalid token",error: err.message });
    }
  }

  if(userID){
    req.userID = userID;
    return next();
  }
 

  return res.status(401).json({ msg: "Unauthorized: No token or ID provided" })
};



module.exports = authMiddleware;