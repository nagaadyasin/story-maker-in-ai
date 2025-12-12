const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import Models
const Village = require('./models/Village');
const WaterPoint = require('./models/WaterPoint');
const Livestock = require('./models/Livestock');
const NGOActivity = require('./models/NGOActivity');
const Alert = require('./models/Alert');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// --- API ROUTES ---

// 1. Villages
app.get('/api/villages', async (req, res) => {
    try {
        const villages = await Village.find();
        res.json(villages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/villages/:id', async (req, res) => {
    try {
        const village = await Village.findById(req.params.id);
        if (!village) return res.status(404).json({ error: 'Village not found' });
        res.json(village);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Water Points
app.get('/api/water-points', async (req, res) => {
    try {
        const waterPoints = await WaterPoint.find().populate('villageId', 'name');
        res.json(waterPoints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/water-points/status', async (req, res) => {
    const { id, status, isFunctional } = req.body;
    try {
        const wp = await WaterPoint.findByIdAndUpdate(
            id,
            { status, isFunctional, lastMaintenanceDate: new Date() },
            { new: true }
        );
        res.json(wp);

        // Auto-create alert if non-functional
        if (!isFunctional) {
            const newAlert = new Alert({
                villageId: wp.villageId,
                type: 'water',
                severity: 'high',
                message: `Water point ${wp.type} marked non-functional.`
            });
            await newAlert.save();
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Livestock
app.get('/api/livestock', async (req, res) => {
    try {
        const livestock = await Livestock.find().populate('villageId', 'name');
        res.json(livestock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. NGO Activities
app.get('/api/ngo-activities', async (req, res) => {
    try {
        const activities = await NGOActivity.find().populate('villageId', 'name');
        res.json(activities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ngo-activities', async (req, res) => {
    try {
        const activity = new NGOActivity(req.body);
        await activity.save();
        res.status(201).json(activity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Alerts
app.get('/api/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().populate('villageId', 'name').sort({ createdAt: -1 });
        res.json(alerts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/alerts/:id/resolve', async (req, res) => {
    try {
        const alert = await Alert.findByIdAndUpdate(req.params.id, { isResolved: true }, { new: true });
        res.json(alert);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Auth (Simple)
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // In real app: check DB and hash
    // Prototype logic:
    let role = null;
    if (username === 'gov' && password === '123') role = 'GOVERNMENT';
    else if (username === 'ngo' && password === '123') role = 'NGO';
    else if (username === 'district' && password === '123') role = 'DISTRICT_OFFICER';

    if (role) {
        // Return a mock user object
        res.json({ username, role });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 DRIP Manager Backend running on port ${PORT}`));