const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const {timestamps} = require("mongodb")

const userSchema = new mongoose.Schema({

    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    userID: {type: String, ref:'User',required:true}
    },{
        timestamps: true,
      })


// hash password before saving

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    console.log("Raw Password Before Hashing:", this.password);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("Hashed Password:", this.password);
    next();
});

const User = mongoose.model("User",userSchema);
module.exports = User;