const Task = require("../models/Task");

const addTask = async(req, res) => {
    try{
        const {title, description, dueDate} = req.body;

        const newtask = new Task({title, description, dueDate})
        await newtask.save();

        res.status(201).json({message: `Task added sucessfully, taskId: ${Task._id}`})

    }catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {addTask}