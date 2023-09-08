// use ajv to validate form input
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import AjvErrors from 'ajv-errors';
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
AjvErrors(ajv);

// add custom keyword to ajv to check if the string is not empty 
// (strange that ajv doesn't have this built-in)
ajv.addKeyword('isNotEmpty', {
  type: 'string',
  validate: function (schema, data) {
    return typeof data === 'string' && data.trim() !== '';
  },
  errors: false,
});

module.exports = ajv;
