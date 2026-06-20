const express=require('express');
const { getIncidents, report, resolveIncidents, verifyIncidents, summarizeVillageIncidents } = require('../controllers/incidentController');
const protect = require('../middlewares/authMiddleware');
const roleAccess = require('../middlewares/roleMiddleware');
const router=express.Router()

router.post('/report',protect,report);

router.get('/get',protect,getIncidents);

router.get(
  "/summary/:village",
  protect,
  roleAccess("officer"),
  summarizeVillageIncidents
);

router.patch(
    "/:id/verify",
    protect,
    roleAccess("officer"),
    verifyIncidents
);

router.patch(
    "/:id/resolve",
    protect,
    roleAccess("officer"),
    resolveIncidents
);

module.exports=router;