const Alert = require("../models/Alert.model");

const generateAlert = async (riskData, incident) => {
  try {
    // console.log("generateAlert called");
    // console.log("Risk Data:", riskData);

    if (riskData.level !== "HIGH") {
      console.log("Risk level is not HIGH");
      return;
    }

    const alert = await Alert.create({
      title: "High Risk Zone Detected",
      message: `Multiple wildlife incidents reported near ${incident.village}. Avoid isolated movement and inform local authorities.`,
      riskLevel: "HIGH",
      affectedArea: incident.village,
      relatedIncidents: [incident._id],
    });

    // console.log("Alert created:", alert);

    return alert;
  } catch (error) {
    console.log("Alert Generation Error:", error);
  }
};

module.exports = generateAlert;