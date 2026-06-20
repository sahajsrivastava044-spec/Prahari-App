const jwt=require('jsonwebtoken');
require('dotenv').config();
const project = async(requestAnimationFrame,res,next)=>{
    let token;

    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ){
        try {
            token = req.headers.authorization(' ')[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decoded;
            next();
        } catch (error) {
            console.log('Token verification Failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
            });
        }
    }
    if(!tokken){
        return res.status(401).json({
            success:false,
            message:'Not autorized, no token provided'
        })
    }
};

module.exports=protect;