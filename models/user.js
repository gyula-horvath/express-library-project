const mongoose = require('mongoose');

//User Schema
const Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['USER', 'STAFF', 'ADMIN'], default: 'USER'}
  }
);

UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);