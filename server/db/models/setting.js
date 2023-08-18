const { Schema, model } = require('mongoose');

const SettingSchema = new Schema({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  dark: {
    type: Schema.Types.Boolean,
    default: false,
  },
  enterToSend: {
    type: Schema.Types.Boolean,
    default: true,
  },
  mute: {
    type: Schema.Types.Boolean,
    default: false,
  },
  sortContactByName: {
    type: Schema.Types.Boolean,
    default: false,
  },
});

module.exports = model('settings', SettingSchema);
