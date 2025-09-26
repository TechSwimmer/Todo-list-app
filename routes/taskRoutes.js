const express = require('express');

const { getAllTasks,submitFeedback,getUserTasks,addUserTask,fetchUserTasks,deleteUserTask,deleteCompletedUsersTasks,
        userCompletedTask,updateUserTask} = require('../controllers/taskController.js')
const router = express.Router();


const authMiddleware = require("../Middleware/userAuthMiddleware.js");




const bodyParser = require('body-parser');

//                                          USER-ROUTES

// Get users tasks
router.get('/user/tasks',authMiddleware, getUserTasks);

// get specific user tasks
router.get('/user/tasks/fetch',authMiddleware, fetchUserTasks);

// get all user specific tasks
router.get('/user/tasks/alltasks',authMiddleware, getAllTasks);

// add user tasks
router.post('/user/tasks/add',authMiddleware, addUserTask);

// mark a users task as completed
router.patch('/tasks/completed/:id', authMiddleware,userCompletedTask)

// delete user tasks
router.delete('/user/tasks/delete/:id',authMiddleware, deleteUserTask);

// delete user specific completed tasks
router.delete('/tasks/delete-completed', authMiddleware,deleteCompletedUsersTasks)

// update a user specific task
router.put('/user/tasks/update/:id', authMiddleware,updateUserTask )




// submit feedback form
router.post("/submit-feedback",submitFeedback);


module.exports = router;