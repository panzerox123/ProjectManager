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
        type: [mongoose.Schema.Types.ObjectId],
    }
});

const Team = mongoose.model('Team',TeamSchema);

exports.Team = Team;