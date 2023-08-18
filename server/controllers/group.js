const GroupModel = require('../db/models/group');
const ProfileModel = require('../db/models/profile');

const response = require('../helpers/response');

exports.findById = async (req, res) => {
  try {
    const group = await GroupModel.findOne({ _id: req.params.groupId });
    response({
      res,
      payload: group,
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

exports.participantsName = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // find group by groupId
    const group = await GroupModel.findOne({ _id: req.params.groupId });

    // find participants
    const participants = await ProfileModel.find(
      { userId: { $in: group.participantsId } },
      { _id: 0, fullname: 1 }
    )
      .sort({ updatedAt: -1 })
      .limit(limit);

    const names = participants.map(({ fullname }) => fullname);

    response({
      res,
      payload: names,
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

exports.participants = async (req, res) => {
  try {
    const { skip, limit } = req.query;
    // find group by groupId
    const group = await GroupModel.findOne({ _id: req.params.groupId });
    // find participants
    const participants = await ProfileModel.find({
      userId: { $in: group.participantsId },
    })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    response({
      res,
      payload: participants,
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
