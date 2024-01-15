import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const attendeeSchema = new Schema({
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  contactPhone: { type: String, required: true},
  email: { type: String, required: true },
  notes: { type: String},
  timeZone: { type: String, required: true }
});

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;
