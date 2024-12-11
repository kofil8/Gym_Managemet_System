import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
    traineeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true }
});

export default mongoose.model('Booking', bookingSchema);