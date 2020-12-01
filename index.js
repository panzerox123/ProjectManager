const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

const userRoute = require('./routes/user.route');
const teamsRoute = require('./routes/teams.route');
const tasksRoute = require('./routes/tasks.route');

app.use(cors({exposedHeaders: ['x-auth-token']}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

if(!config.get("private_key")){
    console.error("Key error");
    process.exit(1);
} else {
    //console.log("Private key defined");
}


app.get('/', (req,res)=> res.status(200).send(`Node backend for Project Management App running on ${PORT}`));

mongoose.connect('mongodb://localhost/project_manager', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("Connected to MongoDB")).catch(err=>{throw err});

app.use('/api/auth', userRoute);
app.use('/api/teams',teamsRoute);
app.use('/api/tasks',tasksRoute);

app.listen(PORT, (console.log(`Server running on port ${PORT}`)));