const { Schema, model } = require('mongoose');

const FileSchema = new Schema(
  {
    fileId: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    originalname: {
      type: Schema.Types.String,
      default: '',
      required: true,
    },
    url: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    type: {
      type: Schema.Types.String,
      required: true,
    },
    format: {
      type: Schema.Types.String,
      required: true,
    },
    size: {
      type: Schema.Types.String,
      default: 0,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = model('files', FileSchema);
