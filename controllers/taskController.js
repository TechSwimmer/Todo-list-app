const todoApp = require('../modals/app-modals');
const express = require('express')
const mongoose = require('mongoose')
const nodemailer = require("nodemailer");
const { updateSearchIndex } = require('../modals/user-modal');
// const router = express.router();



//                                        guest task



// get guest tasks

const getGuestTasks = async(req, res) => {
    try {
        // ✅ Extract guestID from query parameters
        const guestID = req.headers["guest-id"] || req.body.guestID;  

        if (!guestID) {
            return res.status(400).json({ msg: "No guest ID provided" });
        }

        console.log("Fetching tasks for guestID:", guestID);

        // ✅ Fetch tasks where guestID matches
        const guestTasks = await todoApp.find({ guestID: guestID });

        res.json(guestTasks);
    } catch (error) {
        console.error("Error fetching guest tasks:", error.message);
        res.status(500).json({ message: error.message });
    }
}


// add a guest task

const addGuestTask = async (req,res) => {
    
    try {
        const {taskName, taskNotes, taskDate } = req.body;

          // ✅ Extract guestID from headers or body
          const guestID = req.headers["guest-id"] || req.body.guestID;

          if (!guestID) {
              return res.status(400).json({ message: "Guest ID is required" });
          }

          
        const newTask = new todoApp({ guestID, taskName, taskNotes, taskDate})
        await newTask.save();
        res.json(newTask);
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
  

}

// delete guest task

const deleteGuestTask = async (req,res) => {
    try {
        await todoApp.findOneAndDelete({_id:req.params.id, guestID: req.guestID });
        res.json({ msg: "Task deleted"});
    }
    catch(error){
        res.status(500).json({ message : error.message });
    }
}


// get specifc task that the guest requests

const getTodayTask = async (req, res) => {
    try {
        const  guestID  = req.headers["guestID"] || req.guestID; // extract guestID from query params
        const userID = req.headers["userID"] || req.userID;
        // const { id } = req.params;
        if(!guestID && !userID) {
            return res.status(400).json({ msg: "No guestID or userID provided"});
        }
        console.log("Fetching tasks for guestID:", guestID);

        const today = new Date();
        today.setHours(0,0,0,0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);   


        // Fetch tasks associated with guestID
        const Tasks = await todoApp.find(
            {
            $or : [{guestID: guestID,userID: userID}],
            dueDate : {$gte: today, $lt: tomorrow},
            });
        if(!Tasks || Tasks.length === 0){ return res.status(404).json({ msg: "Task not found or unauthorized"})}
        res.json(Tasks);
    }
    catch (error) {
        console.error("Error fetching guest tasks: ", error.message);
        res.status(500).json({ message: " Failed to fetch "});

    }
}








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
        // if(req.headers["userID"]){
        //     filter.userID = req.headers["userID"]
        // }
        // Else, check if guest is provided in headers
        // else if(req.headers["guestID"]){
        //     filter.guestID = req.headers["guestID"];
        // }  
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


// show a specific task

const getSpecificTask = async(req,res) => {
    try{
        const { id } = req.params;
        const idTask = await todoApp.findById(id)
        res.status(200).json(idTask);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

// add a task

const addTask = async(req, res) => {
    try{

        const clientInput = await todoApp.create(req.body);
        res.status(200).json(clientInput);
        
    }
    catch (error){
        res.status(500).json({message: error.message});
    }
}


// update a task

const updateTask = async (req,res) => {
    try{
        const { id } = req.params;
        const taskToUpdate = await todoApp.findByIdAndUpdate(id, req.body, {new:true});

        if(!taskToUpdate){
            res.status(404).json({message: "task not found"});
        }

        res.status(200).json(taskToUpdate);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}


// delete a task

const deleteTask = async(req,res) => {
    try{
        const { id } = req.params;

        const deleteTask = await todoApp.findByIdAndDelete(id);

        if(!deleteTask){
            res.status(404).json({message: "no such task"})
        }
        res.status(200).json({message: "task deleted successfully"});

    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

// update the task that are completed

const completedTask = async(req,res) => {
    try{
        const taskID = req.params.id;
        const updatedTask = await todoApp.findByIdAndUpdate(
            taskID,
            {completed: true },
            {new: true }
        );
        if(!updatedTask){
            return res.status(404).json({message: "Task not found"});
        }
        res.status(200).json(updatedTask);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}

// delete every single task from the dbb

const deleteCompleted = async(req,res)=> {
    try{
        const  guestID  = req.body.guestID;

        console.log(guestID);
        if (!guestID) {
            return res.status(400).json({ message: "Guest ID is required" });
        }

        const result =  await todoApp.deleteMany({completed: true,guestID: guestID});
        if(result.deletedCount > 0){
        res.status(200).send({message: `${result.deletedCount} tasks deleted sucessfully.`})
        }
        else {
            res.status(404).json({ message: 'No completed tasks found.' });
        }
    }
    catch(error){
        
        res.status(500).json({ message: error.message})

    }
}



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
    getSpecificTask,
    addTask,
    updateTask,
    deleteTask,
    completedTask,
    deleteCompleted,
    submitFeedback,
    getUserTasks,
    deleteUserTask,
    addUserTask,
    fetchUserTasks,
    userCompletedTask,
    getGuestTasks,
    addGuestTask,
    deleteGuestTask,
    getTodayTask,
    deleteCompletedUsersTasks

}