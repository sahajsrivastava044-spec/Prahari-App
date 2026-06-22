const Alert = require("../models/Alert.model");



const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true, 
      count: alerts.length,
      alerts
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch alerts"
    });
  }
};

module.exports = {
  getAlerts
};