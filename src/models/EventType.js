import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const eventTypeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
 },
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  link: { type: String, required: true, unique: true },
});

const EventType = mongoose.model('EventType', eventTypeSchema);


export default EventType;

