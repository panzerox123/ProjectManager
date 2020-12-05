const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    parent_task:{
        type: mongoose.Schema.Types.ObjectId
    },
    children: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    taskComments: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    taskStatus:{
        type: Number,
        default: 0
    }
})

const CommentSchema = new mongoose.Schema({
    commentUser: {
        type: String,
    },
    commentText: {
        type: String,
    },
})

const Task = mongoose.model('Task', TaskSchema);
const Comment = mongoose.model('Comment', CommentSchema);

exports.Task = Task;
exports.Comment = Comment;
