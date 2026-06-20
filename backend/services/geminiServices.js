const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

async function summarizeIncidents(incidents){
    try {
        console.log("Gemini Key:", process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model:"gemini-2.0-flash",
        });

        const descriptions = incidents.map((incident,index)=>`${index+1}. ${incident.description}`).join("\n");

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

        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.log("Gemini Error:", error);
        throw error;
    }
}

module.exports={summarizeIncidents};