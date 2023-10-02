const { Schema } = require('mongoose');
const { eCommerceDb } = require('../databases/init.mongodb');
const { generateHashCode } = require('../utils/hashCode');

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    avatar: { type: String },
}, {
    collection: 'users',
    timestamps: true,
});

UserSchema.pre('save', async function(next) {
    try {
      const hasPassword = await generateHashCode(this.password);
      this.password = hasPassword;
      next();
    } catch (error) {
        next(error);
    };
});

module.exports = eCommerceDb.model('users', UserSchema);
