const { hashSync, genSaltSync } = require('bcrypt');

/**
 * Encrypt Secret Data
 * @param {String|Object} target
 * @returns {String|Object}
 */
module.exports = (target = null) => {
  // if target data type is string
  if (typeof target === 'string') {
    // encrypt string
    return hashSync(target, genSaltSync(10));
  }

  // if target data type is object
  const pass = {};

  Object.entries(target).forEach((elem) => {
    pass[elem[0]] = hashSync(elem[1], genSaltSync(10));
  });

  return pass;
};
