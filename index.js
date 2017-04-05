'use strict';

const Ajv = require('ajv');
const jsonSchema = require('./manifest-schema.json');
const validateUrl = require('./src/validate-https-url');

/**
 * @param {Object} json
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
module.exports = function(json) {
  const ajv = new Ajv({
    allErrors: true,
    unknownFormats: true,
    errorDataPath: 'property',
    formats: {
      url: str => validateUrl(str, true),
      'https-url': str => validateUrl(str),
      'relative-path': str => true,
    },
  });
  const validate = ajv.compile(jsonSchema);
  const valid = validate(json);
  return {valid: valid, errors: transformErrors(validate.errors)};
};

/**
 * @param {null|Array<Object>} errors
 * @return {null|Array<Object>} shallow copy of the input or null
 */
function transformErrors(errors) {
  if (!errors) {
    return null;
  }
  // shallow copy
  return errors.slice();
}
