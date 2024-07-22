const Joi = require('joi');

const recipeSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Title should be a string.',
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title should have a minimum length of {#limit}.',
    'string.max': 'Title should have a maximum length of {#limit}.',
    'any.required': 'Title is required.'
  }),
  description: Joi.string().min(10).required().messages({
    'string.base': 'Description should be a string.',
    'string.empty': 'Description cannot be empty.',
    'string.min': 'Description should have a minimum length of {#limit}.',
    'any.required': 'Description is required.'
  }),
  ingredients: Joi.string().required().messages({
    'string.base': 'Ingredients should be a string.',
    'string.empty': 'Ingredients cannot be empty.',
    'any.required': 'Ingredients are required.'
  }),
  steps: Joi.string().required().messages({
    'string.base': 'Steps should be a string.',
    'string.empty': 'Steps cannot be empty.',
    'any.required': 'Steps are required.'
  }),
  authorId: Joi.string().required().messages({
    'string.base': 'Author ID should be a string.',
    'string.empty': 'Author ID cannot be empty.',
    'any.required': 'Author ID is required.'
  })
});

const ratingSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating should be a number.',
    'number.integer': 'Rating should be an integer.',
    'number.min': 'Rating should be at least {#limit}.',
    'number.max': 'Rating should be at most {#limit}.',
    'any.required': 'Rating is required.'
  }),
  comment: Joi.string().min(5).required().messages({
    'string.base': 'Comment should be a string.',
    'string.empty': 'Comment cannot be empty.',
    'string.min': 'Comment should have a minimum length of {#limit}.',
    'any.required': 'Comment is required.'
  })
});

module.exports = { recipeSchema, ratingSchema };
