const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

app.get('/', (req,res)=> res.send(`Node backend for Project Management App running on ${PORT}`));

mongoose.connect('mongodb://localhost/project_manager', {useNewUrlParser: true}).then(()=>console.log("Connected to MongoDB")).catch(err=>console.error(err));

app.listen(PORT, (console.log(`Running on ${PORT}`)));