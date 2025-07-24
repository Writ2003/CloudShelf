import mongoose from 'mongoose';

const publisherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    publisherId: {
        type: String,
        required: true
    }
},{timestamps: true});

const Publisher = mongoose.model('Publisher',publisherSchema);
export default Publisher;