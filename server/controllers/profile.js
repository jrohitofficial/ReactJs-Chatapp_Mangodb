const ProfileModel = require('../db/models/profile');
const ContactModel = require('../db/models/contact');
const response = require('../helpers/response');

exports.findById = async (req, res) => {
  try {
    const targetId = req.params.userId;
    const friendProfile = targetId !== req.user._id;

    const profile = await ProfileModel.findOne({ userId: targetId });

    const contact = friendProfile
      ? await ContactModel.findOne({
          userId: req.user._id,
          friendId: targetId,
        })
      : false;

    response({
      res,
      payload: { ...profile._doc, saved: !!contact },
    });
  } catch (error0) {
    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};

// edit profile
exports.edit = async (req, res) => {
  try {
    const profile = await ProfileModel.updateOne(
      { userId: req.user._id },
      { $set: req.body } // -> object
    );

    response({
      res,
      message: 'Profile updated successfully',
      payload: profile,
    });
  } catch (error0) {
    if (error0.name === 'MongoServerError' && error0.code === 11000) {
      switch (Object.keys(req.body)[0]) {
        case 'username':
          error0.message = 'This username is already taken';
          break;
        case 'phone':
          error0.message = 'This phone number is already taken';
          break;
        default:
          break;
      }
    }

    response({
      res,
      statusCode: error0.statusCode || 500,
      success: false,
      message: error0.message,
    });
  }
};
