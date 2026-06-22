require('dotenv').config();
const express=require('express');
const userRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const alertRoutes=require('./routes/alertRoutes');
const connectDB = require('./config/db');
const cors = require('cors');
const app=express();

const PORT=process.env.PORT || 5000;

app.use(cors());

connectDB();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Welcome to prahari API');
});

app.use('/api/user/',userRoutes);

app.use('/api/incidents',incidentRoutes);

app.use('/api/alerts',alertRoutes);

app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`);
});