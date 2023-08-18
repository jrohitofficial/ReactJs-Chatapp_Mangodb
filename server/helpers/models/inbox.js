const InboxModel = require('../../db/models/inbox');

exports.find = async (queries, search = '') => {
  const inboxes = await InboxModel.aggregate([
    { $match: queries },
    {
      $lookup: {
        from: 'profiles',
        localField: 'ownersId',
        foreignField: 'userId',
        as: 'owners',
      },
    },
    {
      $lookup: {
        from: 'groups',
        localField: 'roomId',
        foreignField: 'roomId',
        as: 'group',
      },
    },
    {
      $unwind: {
        path: '$group',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'files',
        localField: 'fileId',
        foreignField: 'fileId',
        as: 'file',
      },
    },
    {
      $unwind: {
        path: '$file',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $match: {
        $or: [
          {
            roomType: 'private',
            owners: {
              $elemMatch: {
                fullname: { $regex: new RegExp(search), $options: 'i' },
              },
            },
          },
          {
            roomType: 'group',
            'group.name': { $regex: new RegExp(search), $options: 'i' },
          },
        ],
      },
    },
  ]).sort({ 'content.time': -1 });

  return inboxes;
};
