const escapeHtml = require('./escapeHtml.js');

const Joi = require('joi').extend(escapeHtml);

module.exports = Joi.object({
    review: Joi.object({
        rating: Joi.number()
            .min(0)
            .max(5)
            .required(),
        comment: Joi.string()
            .trim()
            .escapeHtml()
            .min(0)
            .max(1000),
    }).required()
});