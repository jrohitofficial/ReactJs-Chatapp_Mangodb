const { compareSync } = require('bcrypt');

/**
 * Decrypt Secret Data
 * @param {String} password
 * @param {String} hash
 * @returns {String|Boolean}
 */
module.exports = (password, hash) => {
  // comparing password
  const match = compareSync(password, hash);

  // if password & hash password does not match
  if (!match) {
    const errData = {
      statusCode: 401,
      message: 'Invalid password',
    };
    throw errData;
  }

  // return normal password if match
  return password;
};
