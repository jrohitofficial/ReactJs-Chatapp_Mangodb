const cloud = require('cloudinary').v2;

const InboxModel = require('../db/models/inbox');
const ChatModel = require('../db/models/chat');
const FileModel = require('../db/models/file');

const response = require('../helpers/response');
const Chat = require('../helpers/models/chats');

exports.findByRoomId = async (req, res) => {
  try {
    const { skip, limit } = req.query;

    const chats = await Chat.find(req.params.roomId, { skip, limit });

    response({
      res,
      message: `${chats.length} chats found`,
      payload: chats,
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

exports.deleteByRoomId = async (req, res) => {
  try {
    const { roomId } = req.params;

    // push userId into deletedBy field
    const inbox = await InboxModel.findOneAndUpdate(
      { roomId },
      { $addToSet: { deletedBy: req.user._id } }
    );

    if (inbox.deletedBy.length + 1 >= inbox.ownersId.length) {
      await InboxModel.deleteOne({ roomId });
      await ChatModel.deleteMany({ roomId });
    } else {
      await ChatModel.updateMany(
        { roomId },
        { $addToSet: { deletedBy: req.user._id } }
      );
    }

    const x = await ChatModel.deleteMany({
      roomId,
      deletedBy: { $size: inbox.ownersId.length },
    });
    const chats = await ChatModel.find(
      { roomId, deletedBy: { $size: inbox.ownersId.length } },
      { fileId: 1 }
    );

    if (x.deletedCount > 0) {
      const filesId = chats
        .filter((elem) => !!elem.fileId)
        .map((elem) => elem.fileId);

      if (filesId.length > 0) {
        await FileModel.deleteMany({ roomId, fileId: filesId });

        await cloud.api.delete_resources(filesId, { resource_type: 'image' });
        await cloud.api.delete_resources(filesId, { resource_type: 'video' });
        await cloud.api.delete_resources(filesId, { resource_type: 'raw' });
      }
    }

    response({
      res,
      message: 'Chat deleted successfully',
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
