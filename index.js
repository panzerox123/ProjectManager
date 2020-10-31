const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000;

const userRoute = require('./routes/user.route');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

if(!config.get("private_key")){
    console.error("Key error");
    process.exit(1);
} else {
    //console.log("Private key defined");
}


app.get('/', (req,res)=> res.status(200).send(`Node backend for Project Management App running on ${PORT}`));

mongoose.connect('mongodb://localhost/project_manager', {useNewUrlParser: true}).then(()=>console.log("Connected to MongoDB")).catch(err=>console.error(err));

app.use('/api/auth', userRoute);

app.listen(PORT, (console.log(`Server running on port ${PORT}`)));