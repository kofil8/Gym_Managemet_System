import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true } // in hours
});

export default mongoose.model('Class', classSchema);