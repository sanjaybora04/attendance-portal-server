const User = require('../db/controllers/user.controller')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')

/**
*Check if user is valid or not
*/
const authCheck = async(req,res,next)=>{
    try{
        const data = jwt.verify(req.headers.token,keys.jwt.secret)
        
        const user = await User.getProfile(data.id)
        if(user){
            req.user = user
            next()
        }
        else{
            res.json({notloggedin:true})
        }
    }catch(err){
        res.json({notloggedin:true})
    }
};

module.exports=authCheck;