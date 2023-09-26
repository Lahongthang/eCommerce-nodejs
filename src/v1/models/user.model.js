const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    avatar: { type: String },
    token: { type: Object },
}, {
    collection: 'users',
    timestamps: true,
});

module.exports = model('users', UserSchema);
