const todoApp = require('../modals/app-modals.js');
const express = require('express')
const mongoose = require('mongoose')

//show all tasks
const getAllTasks = async(req, res) => {
    try{
        const alltasks = await todoApp.find({});
        res.status(200).json(alltasks);
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
}


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
        const result =  await todoApp.deleteMany({completed: true});
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



//  handle feedback submissions from users and stores them in a MongoDB database.

const submitFeedback = async(req,res) => {
    try {
        const newFeedback = new Feedback(req.body);                     // store the feedback data sent by user
        await newFeedback.save();                                       // store feedback in db
        res.status(201).json({message: "Feedback saved successfully!"})
    }
    catch(error){
        res.status(500).json({ message : "Error saving fedback", error})
    }
}


//export all
module.exports = {
    getAllTasks,
    getSpecificTask,
    addTask,
    updateTask,
    deleteTask,
    completedTask,
    deleteCompleted,
    submitFeedback
}