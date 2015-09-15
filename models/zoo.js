var mongoose = require('mongoose');

var zooSchema = new mongoose.Schema ({
name: String,
location: String,
animals: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Animal'
}]
});

zooSchema.pre('remove', function(callback) {
  Zoo.remove({zoo_id: this._id}).exec();
  callback();
});

var Zoo = mongoose.model('Zoo', zooSchema);

module.exports = Zoo;
