require('dotenv').config();
const { summarizeIncidents } = require('./services/geminiServices');

async function test() {
    console.log("Testing gemini summary...");
    const incidents = [
        { description: "Tiger spotted near the water source" },
        { description: "Livestock killed by unknown predator in the night" },
        { description: "Loud roar heard near the village boundary" }
    ];
    try {
        const summary = await summarizeIncidents(incidents);
        console.log("SUCCESS:", summary);
    } catch(err) {
        console.error("FAILED:", err);
    }
}
test();
