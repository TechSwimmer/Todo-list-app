const { Timestamp } = require("mongodb");
const mongoose = require(mongoose);

const feedbackSchema = new mongoose.Schema({
    name : String,
    email : String,
    experience : String,
    satisfaction : String,
    improvement : String,
    issues : String,
    submittedAt : {type: Date, default : Date.now }
    },{
        Timestamps: true
    }
)


const feedbackApp = mongoose.model('Feedback', feedbackSchema);

module.exports = feedbackApp;