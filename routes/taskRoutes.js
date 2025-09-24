const express = require('express');

const { getAllTasks,getSpecificTask,addTask,updateTask,deleteTask, completedTask, deleteCompleted,submitFeedback,
        getUserTasks,addUserTask,fetchUserTasks,deleteUserTask,getGuestTasks,addGuestTask,deleteGuestTask,getTodayTask,
        deleteCompletedUsersTasks,userCompletedTask} = require('../controllers/taskController.js')
const router = express.Router();


const authMiddleware = require("../Middleware/userAuthMiddleware.js");
const guestAuthMiddleware = require("../Middleware/guestAuthMiddleware.js")
// const guestAuthMiddleware =  require("../routes/auth.js");



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



//                                          GUEST ROUTES


// add guest tasks
router.post('/guest/tasks/add', guestAuthMiddleware, addGuestTask)

// get guest task
router.get('/guest/tasks', guestAuthMiddleware, getGuestTasks)


// get today task that the guest requests
router.get('/user/tasks/today', authMiddleware, getTodayTask);

// delete guest tasks
router.delete('/guest/tasks/delete/:id', guestAuthMiddleware, deleteGuestTask);

// delete  completed tasks
router.delete('/guest/tasks/delete-completed', guestAuthMiddleware, deleteCompleted);




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