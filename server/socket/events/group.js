const { io } = global;
const { v4: uuidv4 } = require('uuid');

const ProfileModel = require('../../db/models/profile');
const GroupModel = require('../../db/models/group');
const InboxModel = require('../../db/models/inbox');
const ChatModel = require('../../db/models/chat');

const Inbox = require('../../helpers/models/inbox');

const uniqueId = require('../../helpers/uniqueId');

module.exports = (socket) => {
  socket.on('group/create', async (args, cb) => {
    try {
      const roomId = `group-${uuidv4()}`;

      // get full name of admin
      const profile = await ProfileModel.findOne(
        { userId: args.adminId },
        { fullname: 1 }
      );

      const group = await new GroupModel({
        ...args,
        roomId,
        link: `/group/+${uniqueId(16)}`,
      }).save();

      const inbox = await new InboxModel({
        ownersId: args.participantsId,
        roomId,
        roomType: 'group',
        content: {
          senderName: profile.fullname,
          from: args.adminId,
          text: 'group created',
          time: new Date().toISOString(),
        },
      }).save();

      // include master
      io.to(args.participantsId).emit('group/create', { group, ...inbox._doc });

      // return success callback
      cb({
        success: true,
        message: 'Group created successfully',
      });
    } catch (error0) {
      // return error callback
      cb({
        success: false,
        message: error0.message,
      });
    }
  });

  socket.on('group/add-participants', async (args) => {
    try {
      // get inviter fullname
      const inviter = await ProfileModel.findOne(
        { userId: args.userId },
        { fullname: 1 }
      );
      const group = await GroupModel.findOneAndUpdate(
        { _id: args.groupId },
        { $addToSet: { participantsId: { $each: args.friendsId } } }
      );

      await InboxModel.updateOne(
        { roomId: group.roomId },
        {
          $addToSet: { ownersId: { $each: args.friendsId } },
          $set: {
            fileId: null,
            'content.senderName': inviter.fullname,
            'content.from': args.userId,
            'content.text': `${args.friendsId.length} ${
              args.friendsId.length > 1 ? 'participants' : 'participant'
            } added`,
            'content.time': new Date().toISOString(),
          },
        }
      );

      const inboxes = await Inbox.find({ roomId: args.roomId });

      io.to(inboxes[0].ownersId).emit('inbox/find', inboxes[0]);
    } catch (error0) {
      console.log(error0.message);
    }
  });

  socket.on('group/edit', async ({ groupId, userId, form }, cb) => {
    try {
      const { name = '', desc = '' } = form;
      const errData = {};

      if (name.length < 1 || desc.length > 300) {
        errData.message =
          name.length < 1
            ? 'Group name is required!'
            : 'Description too long (max. 300)';
        throw errData;
      }

      const profile = await ProfileModel.findOne({ userId }, { fullname: 1 });
      const group = await GroupModel.findOneAndUpdate(
        { _id: groupId },
        { $set: { name, desc } }
      );

      await InboxModel.updateOne(
        { roomId: group.roomId },
        {
          $set: {
            fileId: null,
            'content.senderName': profile.fullname,
            'content.from': userId,
            'content.text': 'group edited',
            'content.time': new Date().toISOString(),
          },
        }
      );

      const inboxes = await Inbox.find({ roomId: group.roomId });

      // update group profile
      io.to(group.roomId).emit('group/edit', form);
      // update inbox
      io.to(inboxes[0].ownersId).emit('inbox/find', inboxes[0]);

      // success callback
      cb({ success: true, message: 'Group edited successfully' });
    } catch ({ message }) {
      // error callback
      cb({ success: false, message });
    }
  });

  socket.on('group/exit', async ({ userId, groupId }, cb) => {
    try {
      const group = await GroupModel.findOneAndUpdate(
        { _id: groupId },
        { $pull: { participantsId: userId } }
      );

      // updated participantsId
      const participantsId = group.participantsId.filter(
        (elem) => elem !== userId
      );

      // if you're the last participant in the group
      if (participantsId.length === 0) {
        // permanently delete data (inbox, group, and chats) related to the group
        await InboxModel.deleteOne({ roomId: group.roomId });
        await GroupModel.deleteOne({ _id: groupId });
        await ChatModel.deleteOne({ roomId: group.roomId });
      } else {
        // if you're admin
        if (group.adminId === userId) {
          // give admin status to other participants in the group
          const adminId = participantsId[0];
          await GroupModel.updateOne({ _id: groupId }, { $set: { adminId } });
        }

        const profile = await ProfileModel.findOne({ userId }, { fullname: 1 });

        await InboxModel.updateOne(
          { roomId: group.roomId },
          {
            $pull: { ownersId: userId },
            $set: {
              fileId: null,
              'content.senderName': profile.fullname,
              'content.from': userId,
              'content.text': 'left the group',
              'content.time': new Date().toISOString(),
            },
          }
        );

        const inboxs = await Inbox.find({ roomId: group.roomId });
        // update data in broadcast client
        socket.broadcast.to(participantsId).emit('group/exit', {
          groupId,
          userId,
          inbox: inboxs[0],
        });
      }

      socket.emit('inbox/delete', [group.roomId]);
      // success callback
      cb({ success: true, message: 'Successfully exit the group' });
    } catch ({ message }) {
      // error callback
      cb({ success: false, message });
    }
  });

  socket.on('group/add-admin', async (args) => {
    try {
      const { groupId, userId, participantId } = args;

      const master = await ProfileModel.findOne({ userId }, { fullname: 1 });
      const friend = await ProfileModel.findOne(
        { userId: participantId },
        { fullname: 1 }
      );

      const group = await GroupModel.findOneAndUpdate(
        { _id: groupId },
        { $set: { adminId: participantId } }
      );

      await InboxModel.updateOne(
        { roomId: group.roomId },
        {
          $set: {
            fileId: null,
            'content.senderName': master.fullname,
            'content.from': userId,
            'content.text': `add ${friend.fullname.split(' ')[0]} as admin`,
            'content.time': new Date().toISOString(),
          },
        }
      );

      const inboxes = await Inbox.find({ roomId: group.roomId });

      io.to(group.participantsId).emit('inbox/find', inboxes[0]);
      io.to(group.roomId).emit('group/add-admin', {
        ...group._doc,
        adminId: participantId,
      });
    } catch (error0) {
      console.error(error0.message);
    }
  });

  socket.on('group/remove-participant', async (args) => {
    try {
      const { groupId, userId, participantId } = args;

      const master = await ProfileModel.findOne({ userId }, { fullname: 1 });
      const friend = await ProfileModel.findOne(
        { userId: participantId },
        { fullname: 1 }
      );

      const group = await GroupModel.findOneAndUpdate(
        { _id: groupId },
        { $pull: { participantsId: participantId } }
      );

      await InboxModel.updateOne(
        { roomId: group.roomId },
        {
          $pull: { ownersId: participantId },
          $set: {
            fileId: null,
            'content.senderName': master.fullname,
            'content.from': userId,
            'content.text': `removed ${friend.fullname.split(' ')[0]}`,
            'content.time': new Date().toISOString(),
          },
        }
      );

      const inboxes = await Inbox.find({ roomId: group.roomId });

      // refresh inbox
      socket.broadcast
        .to(participantId)
        .emit('inbox/delete', [inboxes[0].roomId]);
      io.to(inboxes[0].ownersId).emit('inbox/find', inboxes[0]);

      // refresh group participants
      io.to(group.roomId).emit('group/remove-participant', args);
    } catch (error0) {
      console.error(error0.message);
    }
  });
};
