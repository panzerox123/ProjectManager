const { User } = require('../models/user.model');
const { Team } = require('../models/teams.model');
const auth = require('../middleware/auth');
const { Task, Comment } = require('../models/tasks.model');
const express = require('express');
const e = require('express');
const { mongo } = require('mongoose');


async function recursive_deletion (taskID) {
    console.log(taskID);
    let task = await Task.findById(taskID);
    if (!task) return 0;
    for(var i in task.children){
        await recursive_deletion(task.children[i]);
    }
    await Task.findOneAndDelete({_id: task._id}, (err,res) => {
        if(err) throw err
    });
}

const router = express.Router();

router.post('/:teamNumber/createMainTask', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber });
        if (!team) return res.status(404).send("Team not found")
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
    else return res.status(401).send();
})

router.post('/:teamNumber/:taskID/createSubTask', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let parent_task = await Task.findById(req.params.taskID);
        if (!parent_task) return res.status(404).send("Task not found");
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
    } else return res.status(401).send();
})

router.get('/:teamNumber/:taskID/details', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        return res.status(200).json(task)
    } else return res.status(401).send();
})

router.post('/:teamNumber/:taskID/rename', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        task.taskName = req.body.taskName;
        await task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

router.delete('/:teamNumber/:taskID/delete_main_task', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        let index = team.tasks.indexOf(task._id);
        await recursive_deletion(task._id);
        //let index = team.tasks.indexOf(req.params.taskID)
        if(index > -1) team.tasks.splice(index,1)
        await team.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

router.delete('/:teamNumber/:taskID/delete_sub_task', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        let parent_task = await Task.findById(task.parent_task);
        if(!parent_task) res.status(404).send("Parent task does not exist")
        let index = parent_task.children.indexOf(task._id);
        await recursive_deletion(task._id);
        //let index = parent_task.children.indexOf(req.params.taskID)
        if(index > -1) parent_task.children.splice(index,1)
        await parent_task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

router.put('/:teamNumber/:taskID/:status', auth, async (req, res) => {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(401).send()
    if (user.teams.includes(req.params.teamNumber)) {
        let team = await Team.findOne({ teamNumber: req.params.teamNumber })
        if (!team) return res.status(404).send("Team not found")
        let task = await Task.findById(req.params.taskID);
        if (!task) return res.status(404).send("Task not found")
        task.taskStatus = parseInt(req.params.status);
        await task.save();
        return res.status(200).send();
    } else return res.status(401).send();
})

module.exports = router;


