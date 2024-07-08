const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true }, // Adjusted from `instructions`
  images: { type: [String] }, // Adjusted from `image`
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
