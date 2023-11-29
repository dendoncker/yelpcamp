const sanitizeHtml = require('sanitize-html');

module.exports = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHtml': '{{#label}} must not include html tags.',
    },
    rules: {
        escapeHtml: {
            validate(value, options) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return options.error('string.escapeHtml', { value });
                return clean;
            }
        }
    }
});

