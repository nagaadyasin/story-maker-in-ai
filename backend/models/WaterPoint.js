const mongoose = require('mongoose');

const WaterPointSchema = new mongoose.Schema({
    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
    type: { type: String, enum: ['borehole', 'berkad', 'well', 'dam'], required: true },
    status: String, // functional, damaged, dry, empty
    capacityM3: Number,
    isFunctional: { type: Boolean, default: true },
    lastMaintenanceDate: Date
});

module.exports = mongoose.model('WaterPoint', WaterPointSchema);
