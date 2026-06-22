const mongoose = require('mongoose');
const User = require('./models/User.model');
const Incident = require('./models/Incident.model');
const { calculateRisk } = require('./services/riskEngine');

require('dotenv').config();

async function runE2ETest() {
  console.log("Connecting to database...");
  await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/prahari");
  console.log("Connected.");

  try {
    // 1. Simulate finding/creating a user
    let user = await User.findOne({ phone: "9999999999" });
    if (!user) {
      user = await User.create({ name: "Test User", phone: "9999999999", password: "password", village: "Test Village", role: "community" });
    }

    // 2. Clear old incidents for this test user's village to get a clean slate
    await Incident.deleteMany({ village: "Test Village" });

    console.log("\n--- TEST 1: First Incident (Should be LOW/MEDIUM based on single weight) ---");
    const incidentData1 = {
      incidentType: "sighting",
      description: "Saw a tiger",
      location: { lat: 28.6139, lng: 77.2090 }, // New Delhi
      village: "Test Village",
    };
    
    const risk1 = await calculateRisk(incidentData1);
    console.log("Risk for Incident 1:", risk1);
    
    const inc1 = await Incident.create({ ...incidentData1, reporter: user._id, riskScore: risk1.score, riskLevel: risk1.level });
    console.log("Created Incident 1:", inc1._id);

    console.log("\n--- TEST 2: Second Incident Nearby (Score should accumulate) ---");
    const incidentData2 = {
      incidentType: "livestock_attack",
      description: "Cow attacked",
      location: { lat: 28.6140, lng: 77.2091 }, // Very close
      village: "Test Village",
    };

    const risk2 = await calculateRisk(incidentData2);
    console.log("Risk for Incident 2:", risk2); // Should be higher because inc1 is unresolved

    const inc2 = await Incident.create({ ...incidentData2, reporter: user._id, riskScore: risk2.score, riskLevel: risk2.level });
    console.log("Created Incident 2:", inc2._id);

    console.log("\n--- TEST 3: Resolve Incident 1 & Check Risk Engine Again ---");
    inc1.status = 'resolved';
    await inc1.save();
    console.log("Resolved Incident 1.");

    const incidentData3 = {
      incidentType: "sighting",
      description: "Another sighting",
      location: { lat: 28.6141, lng: 77.2092 },
      village: "Test Village",
    };

    const risk3 = await calculateRisk(incidentData3);
    console.log("Risk for Incident 3:", risk3); // Should ignore inc1 because it's resolved!

    console.log("\n--- TEST 4: Fetch Incidents Sorting Check ---");
    const allIncidents = await Incident.find({ village: "Test Village" }).sort({ createdAt: -1 });
    console.log("Fetched Incidents (Expected newest first):");
    allIncidents.forEach((i, idx) => {
      console.log(`${idx + 1}. ${i.incidentType} - Created At: ${i.createdAt} - Status: ${i.status}`);
    });

  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
    console.log("\nDone testing.");
  }
}

runE2ETest();
