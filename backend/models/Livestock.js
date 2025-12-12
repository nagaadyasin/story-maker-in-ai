const mongoose = require('mongoose');

const LivestockSchema = new mongoose.Schema({
    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
    species: { type: String, required: true }, // Camel, Goat, Cattle
    totalCount: Number,
    mortalityRate: Number, // Percentage
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Livestock', LivestockSchema);
