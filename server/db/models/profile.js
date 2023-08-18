const { Schema, model } = require('mongoose');

const ProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.String,
      required: true,
    },
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
    fullname: {
      type: Schema.Types.String,
      trim: true,
      required: true,
      minLength: 3,
      maxLength: 32,
    },
    avatar: {
      type: Schema.Types.String,
      default: null,
    },
    bio: {
      type: Schema.Types.String,
      trim: true,
      default: '',
    },
    phone: {
      type: Schema.Types.String,
      trim: true,
      default: '',
    },
    dialCode: {
      type: Schema.Types.String,
      trim: true,
      default: '',
    },
    online: {
      type: Schema.Types.Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model('profiles', ProfileSchema);
