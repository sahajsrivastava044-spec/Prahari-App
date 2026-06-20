require('dotenv').config();
const express=require('express');
const userRoutes = require('./routes/authRoutes');
const connectDB = require('./config/db');
const app=express();

const PORT=process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Welcome to prahari API');
});

app.use('/api/user/',userRoutes);

app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`);
});