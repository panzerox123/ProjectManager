const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamNumber: {
        type: Number,
        unique: true
    },
    teamName: {
        required: true,
        type: String
    }
});

const Team = mongoose.model('Team',TeamSchema);

exports.Team = Team;