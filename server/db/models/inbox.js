const { Schema, model } = require('mongoose');

const InboxSchema = new Schema(
  {
    ownersId: {
      type: Schema.Types.Array,
      required: true,
    },
    roomId: {
      type: Schema.Types.String,
      required: true,
    },
    roomType: {
      type: Schema.Types.String,
      enum: ['private', 'group'],
      required: true,
      default: 'private',
    },
    archivedBy: {
      type: Schema.Types.Array,
      default: [],
    },
    unreadMessage: {
      type: Schema.Types.Number,
      default: 0,
    },
    fileId: {
      type: Schema.Types.String,
      default: null,
    },
    deletedBy: {
      type: Schema.Types.Array,
      default: [],
    },
    content: {
      from: {
        type: Schema.Types.String, // -> the sender's userId
        required: true,
      },
      senderName: {
        type: Schema.Types.String,
        required: true,
      },
      text: {
        type: Schema.Types.String,
        required: true,
      },
      time: {
        type: Schema.Types.Date,
        required: true,
        default: new Date().toISOString(),
      },
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('inboxes', InboxSchema);
