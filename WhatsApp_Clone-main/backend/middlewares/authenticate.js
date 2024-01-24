const jwt = require("jsonwebtoken");
const User = require('../models/userModel');

const isAuthorized = async(req,res,next)=>{
    const { email } = req.method === "GET" ? req.headers : req.body;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        try {
            token = req.headers.authorization.split('Bearer ')[1];

            //Decode token email
            // token = JSON.parse(token);
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            
            if (email === decoded.email) {
                // console.log("Hello>>>>>",decoded.email);
                req.user = await User.findOne({email:decoded.email}).select('-password');
                next();
            }
            else{
                res.status(401).json('redirect to login page');  
            }
        } catch (error) {
            res.status(401).json(error);
        }
    }
    if (!token) {
        res.status(401).json('Not authorized, no token');
    }
}

module.exports = isAuthorized;