const Joi = require('joi');



  module.exports.festiSchema = Joi.object({
    festival: Joi.object({
      title: Joi.string().required(),
      location: Joi.string().required(),
      // image: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
    }).required(),
    deleteImages: Joi.array()
  });

  module.exports.experienceSchema = Joi.object({
    experience: Joi.object({
      rating: Joi.number().required().min(1).max(5),
      body: Joi.string().required()
    }).required()
  })