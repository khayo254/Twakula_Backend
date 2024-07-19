const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  images: { type: [String] },
  authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  cuisine: { type: String }, // Add cuisine field for categorization
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index definitions for text search and performance
recipeSchema.index({ title: 'text', ingredients: 'text', cuisine: 'text' });
recipeSchema.index({ authorId: 1 });
recipeSchema.index({ 'ratings.userId': 1 });

module.exports = mongoose.model('Recipe', recipeSchema);
