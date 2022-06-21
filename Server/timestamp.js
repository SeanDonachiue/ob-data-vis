import pkg from 'mongoose';
const { model, Schema, Document } = pkg;
const timestampSchema = new Schema({
  stamp: Date,
  price: Number,
  obup: Number,
  obdown: Number,
  volume: Number
});

const TimestampModel = model("Timestamp", timestampSchema);

export {TimestampModel};