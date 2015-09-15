var mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
name: String,
species: String,
age: Number,
photo: String,
zoo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Zoo'
}
});

var Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
