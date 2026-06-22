const { summarizeIncidents } = require("./services/openaiServices");

const testIncidents = [
    { description: "A tiger was seen near the village border.", incidentType: "tiger_sighting" },
    { description: "Cattle was attacked by a leopard.", incidentType: "livestock_attack" }
];

async function runTest() {
    console.log("Testing OpenAI summary...");
    const summary = await summarizeIncidents(testIncidents);
    console.log("Result:");
    console.log(summary);
}

runTest();
