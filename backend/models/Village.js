const mongoose = require('mongoose');

const VillageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    district: String,
    region: String,
    population: Number,
    livestockCount: Number,
    distanceToWaterKm: Number,
    waterAccessLevel: {
        type: String,
        enum: ['High', 'Medium', 'Low', 'Critical'],
        default: 'Medium'
    },
    vulnerabilityScore: Number, // 0-100
    isCovered: { type: Boolean, default: false },
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Village', VillageSchema);
