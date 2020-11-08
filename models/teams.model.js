const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    teamNumber: {
        type: String,
        unique: true
    },
    teamName: {
        required: true,
        type: String
    },
    tasks: {
        type: [String],
    }
});

const Team = mongoose.model('Team',TeamSchema);

exports.Team = Team;