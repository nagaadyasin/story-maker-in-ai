const mongoose = require('mongoose');

const NGOActivitySchema = new mongoose.Schema({
    ngoName: { type: String, required: true },
    activityType: String,
    villageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Village', required: true },
    sector: { type: String, enum: ['WASH', 'Food Security', 'Health', 'Shelter', 'Cash'], default: 'WASH' },
    startDate: Date,
    endDate: Date,
    status: { type: String, enum: ['planned', 'ongoing', 'completed'], default: 'ongoing' },
    coordinates: {
        lat: Number,
        lng: Number
    }
});

module.exports = mongoose.model('NGOActivity', NGOActivitySchema);
