const escapeHtml = require('./escapeHtml.js');

const Joi = require('joi').extend(escapeHtml);

module.exports = Joi.object({
    campground: Joi.object({
        title: Joi.string()
            .trim()
            .escapeHtml()
            .min(5)
            .max(50)
            .required(),
        price: Joi.number()
            .min(0)
            .required(),
        city: Joi.string()
            .trim()
            .escapeHtml()
            .required(),
        state: Joi.string()
            .trim()
            .escapeHtml()
            .required(),
        description: Joi.string()
            .trim()
            .escapeHtml()
            .min(10)
            .max(500)
            .required(),
    }).required(),
    deleteImages: Joi.array()
});