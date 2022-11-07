import mongoose, { Types } from "mongoose"

const { Schema, model } = mongoose;

const UserSchema = new Schema({
   chatId: {
      type: Number,
      required: true,
      unique: true,
   },
   name: {
      type: String,
      default: 'Аноним'
   },
   lastname: {
      type: String,
      default: '',
   },
   username: {
      type: String,
      default: ''
   }
});

export default model('User', UserSchema);