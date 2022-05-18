const router = require("express").Router();
// const mongoose = require('mongoose');

const Task = require('../models/Task.model');
const Project = require('../models/Project.model');

//  Create a new task
router.post('/tasks', (req, res, next) => {
    const { title, description, projectId } = req.body;

    const newTask = { 
        title, 
        description, 
        project: projectId 
    }

    Task.create(newTask)
        .then(taskFromDB => {
            return Project.findByIdAndUpdate(projectId, { $push: { tasks: taskFromDB._id } } );
        })
        .then( response => {
            res.status(201).json(response)
        })
        .catch(err => res.json(err));
});

// Retrieves all of the task
router.get('/tasks', (req, res, next) => {
    Task.find()
      .populate('project')
      .then(allTasks => res.status(200).json(allTasks))
      .catch(err => {
        console.log("error getting all tasks from DB",err)
        res.status(500).json({
          message: "error getting all tasks from DB",
          error: err}
          )});
  });

// Retrieves a specific project by id
router.get('/tasks/:tasksId', (req, res, next) => {
    const { tasksId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(tasksId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    // Each Project document has `tasks` array holding `_id`s of Task documents
    // We use .populate() method to get swap the `_id`s for the actual Task documents
    Task.findById(tasksId)
      .populate('project')
      .then(task => res.status(200).json(task))
      .catch(err => {
        console.log("error getting a specific tasks from DB",err)
        res.status(500).json({
          message: "error getting a specific tasks from DB",
          error: err}
          )});
  });


// Updates a specific task by id
router.put('/tasks/:taskId', (req, res, next) => {
    const { taskId } = req.params;
   
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Task.findByIdAndUpdate(taskId, req.body, { new: true })
      .then((updatedtask) => res.json(updatedtask))
      .catch(error => res.json(error));
  });

  // Deletes a specific task by id
router.delete('/tasks/:tasksId', (req, res, next) => {
    const { tasksId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(tasksId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
   
    Task.findByIdAndRemove(tasksId)
      .then(() => res.json({ message: `ttasks with ${tasksId} is removed successfully.` }))
      .catch(error => res.json(error));
  });

module.exports = router;
