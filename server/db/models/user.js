const { Schema, model } = require('mongoose');
const uniqueId = require('../../helpers/uniqueId');

const UserSchema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 24,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    qrCode: {
      type: Schema.Types.String,
      required: true,
      default: uniqueId(16, { lowercase: false }),
    },
    verified: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
    otp: {
      type: Schema.Types.Number,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('users', UserSchema);
