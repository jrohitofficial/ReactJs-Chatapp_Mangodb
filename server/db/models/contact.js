const { Schema, model } = require('mongoose');

const ContactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      required: true,
    },
    roomId: {
      type: Schema.Types.String,
      required: true,
    },
    friendId: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('contact', ContactSchema);
