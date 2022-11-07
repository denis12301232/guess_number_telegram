import mongoose, { Types } from "mongoose";

const { Schema, model } = mongoose;

const StatSchema = new Schema({
   user: {
      type: Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
   },
   rightAnswers: {
      type: Number,
      default: 0,
   },
   wrongAnswers: {
      type: Number,
      default: 0,
   },
   percent: {
      type: Number,
      default: 0,
   },
   total: {
      type: Number,
      default: 0,
   }
});

export default model('Stat', StatSchema);