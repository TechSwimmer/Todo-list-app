const express = require('express');
const todoApp = require("../modals/app-modals.js");
const { getAllTasks,getSpecificTask,addTask,updateTask,deleteTask } = require('../controllers/taskController.js')
const router = express.Router();
const path = require('path')

const bodyParser = require('body-parser');

// get all the tasks
router.get('/tasks', getAllTasks);

// get a specific task based on the ID
router.get('/tasks/:id', getSpecificTask);

// add a task in the DB
router.post('/tasks/add', addTask);

//update a task in the DB
router.put('/tasks/update/:id', updateTask);

//delete a task from the DB
router.delete('/tasks/delete/:id', deleteTask);

module.exports = router;