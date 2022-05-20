const Joi = require('joi');



  module.exports.festiSchema = Joi.object({
    festival: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
    }).required()
  });

  module.exports.reviewSchema = Joi.object({
    review: Joi.object({
      rating: Joi.number().required(),
      body: Joi.string().required()
    }).required()
  })