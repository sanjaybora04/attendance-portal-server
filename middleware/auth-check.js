const User = require('../controllers/user.controller')
const jwt = require('jsonwebtoken')

/**
*Check if user is valid or not
*/
const authCheck = async(req,res,next)=>{
    try{
        const data = jwt.verify(req.headers.token,process.env.JWT_SECRET)
        
        const user = await User.getProfile(data.id)
        if(user){
            req.user = user
            next()
        }
        else{
            res.json({invalidToken:true})
        }
    }catch(err){
        res.json({invalidToken:true})
    }
};

module.exports=authCheck;