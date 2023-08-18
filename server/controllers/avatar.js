const { v2: cloud } = require('cloudinary');
const ProfileModel = require('../db/models/profile');
const GroupModel = require('../db/models/group');
const response = require('../helpers/response');

exports.upload = async (req, res) => {
  try {
    const { avatar, crop, zoom, targetId = null, isGroup = false } = req.body;

    const upload = await cloud.uploader.upload(avatar, {
      folder: 'avatars',
      public_id: targetId || req.user._id,
      overwrite: true,
      transformation: [
        {
          crop: 'crop',
          x: Math.round(crop.x),
          y: Math.round(crop.y),
          width: Math.round(crop.width),
          height: Math.round(crop.height),
          zoom,
        },
        {
          crop: 'scale',
          aspect_ratio: '1.0',
          width: 460,
        },
      ],
    });

    if (isGroup) {
      await GroupModel.updateOne(
        { _id: targetId },
        { $set: { avatar: upload.url } }
      );
    } else {
      await ProfileModel.updateOne(
        { userId: targetId || req.user._id },
        { $set: { avatar: upload.url } }
      );
    }

    response({
      res,
      message: 'Avatar Uploaded Successfully',
      payload: upload.url,
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
