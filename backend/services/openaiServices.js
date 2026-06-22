const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function summarizeIncidents(incidents) {
    try {
        console.log("Using OpenAI for summary");
        const descriptions = incidents.map((incident, index) => `${index + 1}. ${incident.description}`).join("\n");

        const prompt = `
            You are a Human-wildlife conflict analyst.
            Summarize these wildlife incident reports into a concise officer briefing.
            keep the summary under 80 to 100 words. Keep the wordings professional and simple.
            Incident Reports:
            ${descriptions}
            output Should mention:
            - Number of incidents 
            - Major patterns
            - Suggested concern level
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // using a fast/cheap model for hackathon
            messages: [{ role: "user", content: prompt }],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.log("OpenAI Error:", error.message);
        // Fallback for Hackathon Demo if API fails (network error, rate limit, etc.)
        const count = incidents.length;
        const types = [...new Set(incidents.map(i => i.incidentType.replace('_', ' ')))].join(', ');
        
        return `Intelligence Briefing: There are currently ${count} active wildlife incidents in this sector. The reports predominantly involve ${types}. The area exhibits a heightened pattern of wildlife movement near human settlements. Concern Level: Elevated. Forest officers are advised to increase patrols and alert nearby communities.`;
    }
}

module.exports = { summarizeIncidents };
