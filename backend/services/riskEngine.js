const Incident = require("../models/Incident.model");
const { getDistance } = require("geolib");

const weights = {
  sighting: 10,
  livestock_attack: 8,
  human_encounter: 10,
  roar: 5,
  pugmark: 4,
};

async function calculateRisk(newIncident) {
  try {
    const sevenDaysAgo=new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate()-7);

    const recentIncidents=await Incident.find({
        createdAt:{$gte:sevenDaysAgo},
        status: { $ne: 'resolved' }
    });

    let totalScore=0;
    let nearbyIncidents=[];

    for (const incident of recentIncidents){
        const distance = getDistance(
            {
                latitude: newIncident.location.lat,
                longitude:newIncident.location.lng,
            },
            {
                latitude: incident.location.lat,
                longitude:incident.location.lng,
            }
        );
        if (distance <= 5000) {
            nearbyIncidents.push(incident._id);

            totalScore += weights[incident.incidentType] || 0;
        }
    }
        
    totalScore+=weights[newIncident.incidentType] || 0; 
    
    let level = "LOW";

    if (totalScore >= 20) {
      level = "HIGH";
    } else if (totalScore >= 10) {
      level = "MEDIUM";
    }

    return {
      score: totalScore,
      level,
      nearbyIncidents,
    };
  } catch (error) {
    console.log("Risk Engine Error:", error);
    throw error;
  }
}

module.exports = {
  calculateRisk,
};