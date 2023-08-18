const jwt = require('jsonwebtoken');
const response = require('../helpers/response');

module.exports = (req, res, next) => {
  try {
    const headers = req.headers.authorization;
    const token = headers ? headers.split(' ')[1] : null;

    req.user = jwt.verify(token, 'shhhhh');
    next();
  } catch (error0) {
    response({
      res,
      statusCode: 401,
      success: false,
      message: error0.message,
    });
  }
};
