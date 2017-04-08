'use strict';

const Ajv = require('ajv');
const jsonSchema = require('./manifest-schema.json');
const validateUrl = require('./src/validate-https-url');

/**
 * @param {Object} json
 * @param {Object=} options
 * @return {{valid: boolean, errors: Array<!Object>}} errors is null if valid
 */
module.exports = function(json, options) {
  options = options || {};
  let relativePath = () => true;
  let maxFileSize = () => true;
  if (typeof options.relativePath === 'function') {
    relativePath = options.relativePath;
  }
  if (typeof options.maxFileSize === 'function') {
    maxFileSize = options.maxFileSize;
  }
  const ajv = new Ajv({
    allErrors: true,
    unknownFormats: true,
    errorDataPath: 'property',
    formats: {
      url: str => validateUrl(str, true),
      'https-url': str => validateUrl(str),
      'relative-path': relativePath,
    },
  });

  ajv.addKeyword('maxFileSize', {
    validate(schema, data) {
      // schema: max file size in bytes
      // data: path to the file
      return maxFileSize(schema, data);
    },
    // TODO: generate custom error message
    errors: false,
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
