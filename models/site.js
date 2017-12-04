var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;

var schema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  name: {type: String, unique: true, required: true},
  domain: {type: String, trim: true, required: true},
  includeLang: {type: [String], required: true},
  language: {type: [String], required: true},
  feature: {type: [String], required: true},
  created: {type: Date, default: Date.now}
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Site = mongoose.model('Site', schema);

module.exports = Site;
