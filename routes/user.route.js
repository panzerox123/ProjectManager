const {User} = require('../models/user.model');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const express = require('express');
const {Team} = require('../models/teams.model');

const router = express.Router();

router.get('/current', auth, async(req,res) => {
    const user = await User.findById(req.user._id).select("-password");
    if(!user) return res.status(401).send();
    return res.status(200).send(user);
})

router.post('/userCreate', async(req,res) => {
    let user = await User.findOne({email: req.body.email}) || await User.findOne({userName:req.body.userName});
    if(user) {
        user.testToken();
        return res.status(409).send("User already exists.");
    }

    user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        teams: []
    });
    user.password = await bcrypt.hash(user.password,10);
    await user.save();
    const token = user.generateAuthToken();
    return res.status(200).header("x-auth-token", token).send({
        _id: user._id,
        name: user.userName,
        email: user.email
    })
})

router.post('/userLogin', async(req,res) => {
    let user = await User.findOne({userName: req.body.userName});
    if(!user) return res.status(404).send('User Not found');
    entered_pass = bcrypt.compare(req.body.password, user.password, (err, pass)=>{
        if(err) return res.status(400).send('Something went wrong.');
        if(pass){
            const token = user.generateAuthToken();
            return res.status(200).header('x-auth-token', token).send(user.email);
        } else {
            return res.status(401).send("Wrong password.");
        }
    })
})

router.get('/teams',auth,async(req,res)=>{
    let user = await User.findById(req.user._id);
    if(!user) return res.status(404).send();
    else {
        var return_arr = [];
        console.log(user.teams);
        for(id in user.teams){
            var team = await Team.findOne({teamNumber: user.teams[id]});
            if(!team) res.status(404).send();
            else return_arr.push(team); 
        }
        return res.status(200).json(return_arr);
    }
})

module.exports = router;
