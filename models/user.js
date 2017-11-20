const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;

var schema = new Schema({
  email: {type: String, required: true, index: true, unique: true, trim:true},
  name: {type: String, required: true, trim: true},
  password: {type: String},
  createAt: {type: Date, default: Date.now}
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password){
  return bcrypt.hash(password, 10);
}

schema.methods.validatePassword = function(password){
  return bcrypt.compare(password, this.password); //return Promise
};

var User = mongoose.model('User', schema);

module.exports = User;
