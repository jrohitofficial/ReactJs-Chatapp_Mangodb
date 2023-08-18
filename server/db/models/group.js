const { Schema, model } = require('mongoose');
const uniqueId = require('../../helpers/uniqueId');

const GroupSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.String,
      required: true,
    },
    adminId: {
      type: Schema.Types.String,
      required: true,
    },
    participantsId: {
      type: Schema.Types.Array,
      required: true,
    },
    name: {
      type: Schema.Types.String,
      maxLength: 32,
      required: true,
    },
    desc: {
      type: Schema.Types.String,
      maxLength: 300,
      default: '',
    },
    avatar: {
      type: Schema.Types.String,
      default: null,
    },
    link: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      default: `/group/+${uniqueId(16)}`,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('groups', GroupSchema);
