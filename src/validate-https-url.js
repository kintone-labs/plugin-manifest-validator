"use strict";

/**
 * @param {string} str
 * @param {boolean=} opt_allowHttp
 * @return {boolean}
 */
function validateHttpsUrl(str, opt_allowHttp) {
  if (opt_allowHttp) {
    return /^https?:/.test(str);
  }
  return /^https:/.test(str);
}

module.exports = validateHttpsUrl;
