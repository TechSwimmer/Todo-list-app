const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");  // use express-valid to validate user
const User = require("../modals/user-modal");


const userAuthMiddleware = require('../Middleware/userAuthMiddleware');

require('dotenv').config()

const JWT_SECRET = process.env.SECRET_KEY;

const router = express.Router();


 
// 🔹 Register User
router.post(
    "/register",
    // validation rules for registration fields (validation middleware- express validator)
    [
      body("username").trim().notEmpty().withMessage("Username is required"),
      body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
      body("password").trim().isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
      const { username, email, password } = req.body;
      let userID;
      try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });
        
        
        userID = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}`;            // userID to diff tasks w.r.t users
        
        user = new User({ username, email,userID,password });
       
        await user.save();
  
        const payload = { userID: user.userID } ;
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  
        res.json({ token });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: "Internal Server Error", error: err.message });
      }
    }
  );
  
  // 🔹 Login User
  router.post(
    "/login",
    // validation rules for login fields (validation middleware- express validator)

    [
      body("email").trim().isEmail().withMessage("Invalid email").normalizeEmail(),
      body("password").trim().notEmpty().withMessage("Password is required")
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
     
      
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
  
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });
  
        const payload = { userID: user.userID  };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  
        res.json({ token,userID: user.userID });
      } catch (err) {
        console.error(err.message);
        res.status(500).json({msg: err.message});
      }
    }
  );
  
 


  module.exports = router;
  // console.log(localStorage.getItem('guestID'));