const {User} = require('../models/user.model');
const {Team} = require('../models/teams.model');
const auth = require('../middleware/auth');
const {Task, Comment} = require('../models/tasks.model');
const express = require('express');
const e = require('express');
const { mongo } = require('mongoose');
const router = express.Router();

router.post('/:teamNumber/createMainTask',auth,async (req,res) => {
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401)
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber});
        if(!team) return res.status(404).send("Team not found")
        let task = new Task({
            taskName: req.body.taskName,
            children: [],
            taskComments: [],
            parent_task: null
        });
        await task.save();
        team.tasks.push(task._id);
        await team.save();
        return res.status(200).json(task);
    }
    else return res.status(401);
})

router.post('/:teamNumber/:taskID/createSubTask', auth, async (req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401)
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber})
        if(!team) return res.status(404).send("Team not found")
        let parent_task = await Task.findById(req.params.taskID);
        if(!parent_task) return res.status(404).send("Task not found");
        let task = new Task({
            taskName: req.body.taskName,
            children: [],
            taskComments: [],
            parent_task: parent_task._id
        });
        await task.save();
        parent_task.children.push(task._id);
        await parent_task.save();
        return res.status(200).send(task);
    } else return res.status(401);
})

router.get('/:teamNumber/:taskID/details', auth, async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401)
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber})
        if(!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if(!task) return res.status(404).send("Task not found")
        return res.status(200).json(task)
    } else return res.status(401);
})

router.post('/:teamNumber/:taskID/rename',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401)
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber})
        if(!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if(!task) return res.status(404).send("Task not found")
        task.taskName = req.body.taskName;
        await task.save();
        return res.status(200).send();
    } else return res.status(401);})

router.delete('/:teamNumber/:taskID/delete', auth, async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(401)
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber})
        if(!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if(!task) return res.status(404).send("Task not found")
        if(task.parent_task!=null){
            let parent = await Task.findById(task.parent_task);
            for(var i = 0; i<parent.children.length; i++){
                if (parent.children[i] == task._id){
                    parent.children.splice(i,1);
                }
            }
            await parent.save();
        } else {
            for(var i = 0; i<team.tasks.length; i++){
                if (team.tasks[i] == task._id){
                    team.tasks.splice(i,1);
                }
            }
            await team.save();
        }
        await Task.findByIdAndDelete(task._id);
        res.status(200).send("Delete successful");
    } else return res.status(401);
})

module.exports = router;


