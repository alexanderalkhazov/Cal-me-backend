import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const bookingSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  eventType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EventType"
  },
  attendee: {
    type: Schema.Types.ObjectId, ref: 'Attendee'
  },
  date: { type: Date, required: true },
  isCanceled: { type: Boolean, required: true, default: false },
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;