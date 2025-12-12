const mongoose = require('mongoose');
require('dotenv').config();

const Village = require('./models/Village');
const WaterPoint = require('./models/WaterPoint');
const Livestock = require('./models/Livestock');
const NGOActivity = require('./models/NGOActivity');
const Alert = require('./models/Alert');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => seedData())
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

const seedData = async () => {
    console.log("🌱 Seeding Database...");

    try {
        // Clear existing data
        await Village.deleteMany({});
        await WaterPoint.deleteMany({});
        await Livestock.deleteMany({});
        await NGOActivity.deleteMany({});
        await Alert.deleteMany({});

        // 1. Villages
        const villages = await Village.insertMany([
            { name: 'Ceel Waaq', district: 'El Wak', region: 'Gedo', population: 4500, livestockCount: 12000, distanceToWaterKm: 12, waterAccessLevel: 'Low', vulnerabilityScore: 78, isCovered: false },
            { name: 'Doolow', district: 'Doolow', region: 'Gedo', population: 12000, livestockCount: 8000, distanceToWaterKm: 2, waterAccessLevel: 'High', vulnerabilityScore: 25, isCovered: true },
            { name: 'Luuq', district: 'Luuq', region: 'Gedo', population: 8500, livestockCount: 15000, distanceToWaterKm: 0.5, waterAccessLevel: 'Medium', vulnerabilityScore: 45, isCovered: true },
            { name: 'Garbahaarrey', district: 'Garbahaarrey', region: 'Gedo', population: 6200, livestockCount: 9500, distanceToWaterKm: 8, waterAccessLevel: 'Low', vulnerabilityScore: 65, isCovered: false },
            { name: 'Baardheere', district: 'Baardheere', region: 'Gedo', population: 15000, livestockCount: 22000, distanceToWaterKm: 1, waterAccessLevel: 'High', vulnerabilityScore: 30, isCovered: true },
            { name: 'Afmadow', district: 'Afmadow', region: 'Lower Juba', population: 7800, livestockCount: 18000, distanceToWaterKm: 15, waterAccessLevel: 'Critical', vulnerabilityScore: 92, isCovered: false },
            { name: 'Kismayo (Rural)', district: 'Kismayo', region: 'Lower Juba', population: 3500, livestockCount: 6000, distanceToWaterKm: 5, waterAccessLevel: 'Medium', vulnerabilityScore: 50, isCovered: true },
            { name: 'Badhaadhe', district: 'Badhaadhe', region: 'Lower Juba', population: 4200, livestockCount: 8500, distanceToWaterKm: 22, waterAccessLevel: 'Critical', vulnerabilityScore: 88, isCovered: false },
        ]);

        const [v1, v2, v3, v4, v5, v6, v7, v8] = villages;

        // 2. Water Points
        await WaterPoint.insertMany([
            { villageId: v1._id, type: 'borehole', status: 'functional', capacityM3: 500, isFunctional: true },
            { villageId: v1._id, type: 'berkad', status: 'empty', capacityM3: 100, isFunctional: true },
            { villageId: v6._id, type: 'borehole', status: 'damaged', capacityM3: 600, isFunctional: false },
            { villageId: v8._id, type: 'well', status: 'dry', capacityM3: 50, isFunctional: true },
        ]);

        // 3. Livestock
        await Livestock.insertMany([
            { villageId: v1._id, species: 'Camel', totalCount: 4000, mortalityRate: 15 },
            { villageId: v1._id, species: 'Goat', totalCount: 8000, mortalityRate: 18 },
            { villageId: v6._id, species: 'Camel', totalCount: 6000, mortalityRate: 35 },
            { villageId: v6._id, species: 'Cattle', totalCount: 2000, mortalityRate: 40 },
            { villageId: v8._id, species: 'Goat', totalCount: 5000, mortalityRate: 28 },
        ]);

        // 4. NGO Activities
        await NGOActivity.insertMany([
            { ngoName: 'Save the Children', activityType: 'Water Trucking', villageId: v6._id, sector: 'WASH', startDate: new Date('2025-03-01'), endDate: new Date('2025-04-01'), status: 'ongoing', coordinates: { lat: 0.5, lng: 42.5 } },
            { ngoName: 'WFP', activityType: 'Cash Relief', villageId: v3._id, sector: 'Cash', startDate: new Date('2025-02-15'), endDate: new Date('2025-06-15'), status: 'ongoing', coordinates: { lat: 3.8, lng: 42.5 } },
        ]);

        // 5. Alerts
        await Alert.insertMany([
            { villageId: v6._id, type: 'livestock', severity: 'critical', message: 'Mortality rate > 30% reported in Afmadow' },
            { villageId: v8._id, type: 'water', severity: 'high', message: 'Critical water shortage in Badhaadhe', createdAt: new Date(Date.now() - 86400000) },
        ]);

        console.log("✅ Useeding Complete!");
        process.exit(0);

    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};
