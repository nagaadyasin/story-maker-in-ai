const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
    type: { type: String, enum: ['water', 'livestock', 'disease', 'conflict'], required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    message: String,
    isResolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', AlertSchema);
