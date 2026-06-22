const Incident = require("../models/Incident.model");
const generateAlert = require("../services/alertService");
const { calculateRisk } = require("../services/riskEngine");
const { summarizeIncidents } = require("../services/openaiServices");

const report = async (req, res) => {
    try {

        // console.log(req.user.id);
        if (!req.body.description || !req.body.location || !req.body.incidentType) {
            return res.status(400).json({
                message: "Please provide all required fields",
            });
        }

        const riskData = await calculateRisk(req.body);

        const incident = await Incident.create({
            ...req.body,
            reporter: req.user.id,
            riskScore: riskData.score,
            riskLevel: riskData.level
        });

        await incident.save();

        await generateAlert(riskData,incident);

        res.status(201).json({
            message: "Incident reported successfully",
            incident,
        });
    } catch (error) {
        console.error("Incident Reporting Error:", error);
        res.status(500).json({
            message: "Internal server error",
        });
    }
}


const getIncidents = async (req,res)=>{
    const incidents = await Incident.find().sort({ createdAt: -1 }).populate('reporter', 'name phone village');
    res.status(200).json({
        incidents
    });
}

const verifyIncidents=async (req,res)=>{
    try {
        const incident = await Incident.findById(req.params.id);
        if(!incident){
            return res.status(404).json({
                message:"Incident not found"
            });
        }
        incident.status="verified";
        await incident.save();

        res.status(200).json({
            message:"Incident verified successfully",
            incident
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const resolveIncidents=async(req,res)=>{
    try{
        const incident = await Incident.findById(req.params.id);
        if (!incident){
            return res.status(404).json({
                message:"Incident not found"
            });
        }
        incident.status="resolved";
        await incident.save();

        res.status(200).json({
            message:"Incident verified successfully",
            incident
        });
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }

}

const summarizeVillageIncidents=async (req,res)=>{
    try{
        const {village}=req.params;
        const incidents=await Incident.find({
            village,
        });

        if (incidents.length === 0){
            return res.status(404).json({
                message:"No incidents found for this village",
            });
        }

        let summary;

        try {
            summary = await summarizeIncidents(incidents);
        } catch (error) {

        // Fallback summary for demo safety
            summary = `${incidents.length} wildlife incidents have been reported around ${village}. Recent reports include ${incidents
                .map(i => i.incidentType)
                .join(", ")}. The area requires increased vigilance and monitoring by forest authorities.`;
            }

        res.status(200).json({
            village,
            totalIncidents:incidents.length,
            summary,
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Failed to generate summary"
        });
    }
}

module.exports={
    report,
    getIncidents,
    verifyIncidents,
    resolveIncidents,
    summarizeVillageIncidents
}

