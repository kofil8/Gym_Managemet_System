import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true },
    trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User ' }]
});

export default mongoose.model('Schedule', scheduleSchema);