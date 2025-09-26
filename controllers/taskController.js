const todoApp = require('../modals/app-modals');
const express = require('express')

const nodemailer = require("nodemailer");
const { updateSearchIndex } = require('../modals/user-modal');
// const router = express.router();







// Get users's tasks

const getUserTasks = async(req, res) => {

    const userID = req.headers.userid;
    const userTasks = await todoApp.find({userID: req.headers.userID});
    res.json(userTasks);
}


// add user specific task

const addUserTask =  async(req, res) => {
    
    const { taskName, taskNotes, taskDate } =  req.body;
    const userID = req.user.userID;
    const newTask = new todoApp({ taskName, taskNotes, taskDate, userID});
    await newTask.save();
    res.json(newTask);

} 


// Delete user specific task

const deleteUserTask = async (req,res) => {
    await todoApp.findOneAndDelete({_id: req.params.id, userID: req.user.id});
    res.json({msg: "Task deleted"});
}

// delete user specific completed tasks

const deleteCompletedUsersTasks = async(req, res) => {
    try {
        let filter = {};

        // check if user is logged in (via JWT token)
        if (req.user) {
            filter.userID = req.user.userID;

        }
        
        else{
            return res.status(400).json({msg : "userID or guestID required."})
        }

        // delete the completed tasks
        filter.completed = true;

        // perform deletion
        const result = await todoApp.deleteMany(filter);

        res.json({ message: `Deleted ${result.deletedCount} completed tasks.`})
    }
    catch(err){
        console.error("Error deleting completed tasks:", err);
        res.status(500).json({ message: "Internal server error." });
    }
}


// fetch specific user tasks

const fetchUserTasks = async (req,res) => {
    try{
        let filter = {};
        if (req.headers["guestid"]){
            filter.guestID = req.headers["guestid"];
        }
        else if(req.headers["userid"]){
            filter.userID = req.headers["userid"]; 
        }
        else {
            return res.status(400).json({msg : "userID or guestID required."})
        }
        

        const { year, month, day } = req.query;
        if (year && month && day) {
            const startOfDay = new Date(Date.UTC(year, month - 1, day));
            const endOfDay = new Date(Date.UTC(year, month - 1, day));
            endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);

            filter.taskDate = {
                $gte: startOfDay,
                $lt: endOfDay
            };
        }

        const result = await todoApp.find(filter);
        console.log(result)
        return res.status(200).json(result)
    }
    catch(err){
        console.error("Error deleting completed tasks:", err);
        res.status(500).json({ message: "Internal server error.", error: err.message });
    }
}
// module.exports = router;


// set a users task as completed

const userCompletedTask = async(req,res) => {
    try{
        const taskID = req.params.id;
        const updatedTask = await todoApp.findByIdAndUpdate(
            taskID,
            {completed: true},
            {new: true}

        )
        if(!updatedTask){
            res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(updatedTask)

    }
    catch(error) {
        res.status(400).json({message:error.message})
    }
}

// update task wrt user 
const updateUserTask = async (req, res) => {
    try{
        const taskId = req.params.id;
        const userID = req.user.userID;

        const taskToUpdate = await todoApp.findByIdAndUpdate(
            {
                _id:taskId,
                userID:userID,
                completed:false
            },
            req.body,
            {
                new:true,
                runValidator:true
            }
        )

        if(!taskToUpdate){
            return res.status(404).json({
                error:"Task not found, already completed, or no permission to update"
            });
        }

        // send success response
        res.json({
            message: "Task updated successfully",
            task:taskToUpdate
        })
    }catch(err){
        res.status(500).json({
            error:"Internal server error",
            details: err.message
        })
    }
 
}




// fetch all tasks wrt users
const getAllTasks = async(req, res) => {
    try{
        const userId = req.headers.userid;
        if(!userId){ return res.status(400).json({ msg: "No userID provided"})}
        const filter = {userID: userId};
        const result = await todoApp.find(filter);
        return res.status(200).json(result)
    }
    catch (err){
        console.error("Error fetching tasks:", err);
        res.status(500).json({message: "Internal server error.", error: err.message});
    }
};




// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider (Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password or email password
    },
});

//  handle feedback submissions from users and stores them in a MongoDB database.

const submitFeedback = async(req,res) => {
    try{
        console.log("Feedback received: ", req.body);

        const {name,email,experience, satisfaction, improvement,issues} = req.body;
        const newFeedback = new Feedback(req.body);
        await newFeedback.save();

        if(!req.body.name){
            return res.status(400).json({message: "Name is required"})
        }

        // send mail
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "niku101095@gmail.com",
            subject: "New feedback submission",
            text:`
                Name: ${name}
                Email: ${email}
                Experience: ${experience}
                Satisfaction: ${satisfaction}
                Improvement: ${improvement}
                Issues: ${issues} 
            
            ` 

        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({message: "Feedback submitted and email sent successfully!"})
    }
    catch(error){
        // console.error("Error submitting feedback:", error);
        res.status(500).json({message: "Error submitting feedback", error: error.message})
    }
};



//export all
module.exports = {
    getAllTasks,
    submitFeedback,
    getUserTasks,
    deleteUserTask,
    addUserTask,
    fetchUserTasks,
    userCompletedTask,
    deleteCompletedUsersTasks,
    updateUserTask
}