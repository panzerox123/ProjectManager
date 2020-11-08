const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
    },
    taskStatus: {
        type: Number
    },
    subTasks: {
        type: [String]
    }
})

const SubTaskSchema = new mongoose.Schema({
    subTaskName: {
        type: String
    },
    subTaskStatus: {
        type: Number
    },
    subTaskDesc: {
        type: String
    }
})

const Task = mongoose.model('Task', TaskSchema);
const SubTask = mongoose.model('SubTask', SubTaskSchema);

exports.Task = Task;
exports.SubTask = SubTask;
