const {User} = require('../models/user.model');
const {Team} = require('../models/teams.model');
const auth = require('../middleware/auth');
const {Task,SubTask} = require('../models/tasks.model');
const express = require('express');
const router = express.Router();

router.post('/:teamNumber/newTask',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401);
    if(!user.teams.includes(req.params.teamNumber)) return res.status(401);
    let team = await Team.findOne({teamNumber: req.params.teamNumber});
    let task = new Task({
        taskName: req.body.taskName,
        taskStatus: 0,
        subTasks: []
    });
    await task.save();
    team.tasks.push(task._id);
    await team.save();
    res.status(200).send(team.tasks);
})

router.get('/:teamNumber/tasks',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401);
    if(!user.teams.includes(req.params.teamNumber)) return res.status(401);
    let team = await Team.findOne({teamNumber: req.params.teamNumber});
    var taskList = [];
    for(index in team.tasks){
        var temp_task = await Task.findById(team.tasks[index]);
        if(!temp_task) res.status(404);
        else taskList.push(temp_team);
    }
    return res.status(200).send(taskList);
})

router.post('/:teamNumber/newSubTask',auth,async(req,res) => {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401);
    if(!user.teams.includes(req.params.teamNumber)) return res.status(401);
    let team = await Team.findOne({teamNumber: req.params.teamNumber});
    let task = await Task.findById(req.body.taskID);
    if(!task) return res.status(404);
    if(!team.tasks.includes(task._id)) return res.status(401);
    let subTask = new SubTask({
        subTaskName: req.body.subTaskName,
        subTaskDesc: req.body.subTaskDesc,
        subTaskStatus: 0
    })
    await subTask.save();
    task.subTasks.push(subTask._id);
    await task.save();
    res.status(200).send(task.subTasks);
})

router.get('/:teamNumber/:taskID/', auth, async(req,res) => {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401);
    if(!user.teams.includes(req.params.teamNumber)) return res.status(401);
    let team = await Team.findOne({teamNumber: req.params.teamNumber});
    if(!team) return res.status(404);
    if(!team.tasks.includes(req.params.taskID)) return res.send(404);
    let task = await Task.findById(req.params.taskID);
    if(!task) return res.status(404);
    var subTaskList = [];
    for(i in task.subTasks){
        var temp_st = await SubTask.findById(task.subTasks[i]);
        if(!temp_st) res.status(404);
        else subTaskList.push(temp_st);
    }
    return res.status(200).send(subTaskList);
})

module.exports = router;