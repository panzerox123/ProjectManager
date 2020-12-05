//const {User} = require('../models/user.model');
const {Team} = require('../models/teams.model');
const auth = require('../middleware/auth');
const express = require('express');
const { User } = require('../models/user.model');

const router = express.Router();

router.post('/createTeam', auth, async (req,res) => {
    console.log(req.body.teamName)
    let team = new Team({
        teamNumber: Date.now().toString(),
        teamName: req.body.teamName,
        tasks: []
    });
    await team.save();
    let user = await User.findById(req.user._id);
    user.teams.push(team.teamNumber);
    await user.save();
    res.status(200).send(team);
})

router.post('/joinTeam',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user)return res.status(401).send();
    let team = Team.findById(req.body.teamNumber);
    if(!team) return res.send(404).send();
    user.teams.push(req.body.teamNumber);
    await user.save();
    return res.status(200).send();
})

router.get('/team/:teamNumber', auth, async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(404).send();
    if(user.teams.includes(req.params.teamNumber)){
        let team = await Team.findOne({teamNumber: req.params.teamNumber});
        if(!team) return res.status(404).send("Team does not exist");
        else return res.status(200).send(team);
    } else return res.status(401).send("Unauthorised");
})

module.exports = router;
