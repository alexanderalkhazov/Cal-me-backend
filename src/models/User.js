import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshToken: { type: String },
  imageUrl: { type: String},
  bookings: [
    { type: Schema.Types.ObjectId, ref: "Booking" }
  ],
  eventTypes: [
    { type: Schema.Types.ObjectId, ref: "EventType" }
  ],

  availabilitySettings: {
    timeZone: { type: String, default: 'Asia/Jerusalem' },
    days: [
      {
        isToggledOn: { type: Boolean, required: true },
        day: { type: String, enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
  },
});

const User = mongoose.model('User', userSchema);

export default User;