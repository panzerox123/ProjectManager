const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const UserSchema = new mongoose.Schema(
    {
        userName: {
            required: true,
            unique: true,
            type: String
        },
        password: {
            required: true,
            type: String
        },
        teams: {
            type: [Number]
        }
    }
);

UserSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({_id: this._id}, config.get('private_key'));
    return token;
}

const User = mongoose.model('User',UserSchema);

exports.User = User;