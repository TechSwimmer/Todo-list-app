const express = require('express');
const todoApp = require("../modals/app-modals.js");
const { getAllTasks,getSpecificTask,addTask,updateTask,deleteTask, completedTask, deleteCompleted, submitFeedback } = require('../controllers/taskController.js')
const router = express.Router();
const path = require('path')

const bodyParser = require('body-parser');

// get all the tasks
router.get('/tasks', getAllTasks);

// get a specific task based on the ID
router.get('/tasks/:id', getSpecificTask);

// add a task in the DB
router.post('/tasks/add', addTask);
// delete every task from db
router.delete('/tasks/delete-completed', deleteCompleted);

//update a task in the DB
router.put('/tasks/update/:id', updateTask);





//delete a task from the DB
router.delete('/tasks/delete/:id', deleteTask);

//update completed to be true when clicked on task done. 
router.patch('/tasks/completed/:id', completedTask);



// submit feedback form
router.post("/submit-feedback",submitFeedback);


module.exports = router;