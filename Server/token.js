import pkg from 'mongoose';
const { model, Schema, Document } = pkg;
// interface ITimestamp extends Document{
//   stamp: Date,
//   price: number,
//   obup: number,
//   obdown: number,
//   volume: number,
// }

// interface IToken extends Document {
//    ticker: string,
//    pair: string,
//    timestamps: [ITimestamp]
// }

const timestampSchema = new Schema({
  stamp: Date,
  price: Number,
  obup: Number,
  obdown: Number,
  volume: Number,
});

const TimestampModel = model("Timestamp", timestampSchema);

const tokenSchema = new Schema({
  token: String,
  pair: String,
  exchange: String,
  timestamps: [timestampSchema]
});

const TokenModel = model("Token", tokenSchema);

export { TimestampModel };
export default TokenModel;
