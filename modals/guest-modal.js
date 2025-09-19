// const  {timestamps}  = require("mongodb");
const mongoose = require('mongoose');

// create a modal that would save  guest info in the db
const guestSchema = new mongoose.Schema({
    username : {type: String,required: true, unique: true},
   
    guestID: {type: String, required: true}

},{
    
        timestamps: true,
      
})



const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;