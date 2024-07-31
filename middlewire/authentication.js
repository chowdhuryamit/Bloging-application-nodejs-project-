const {createToken,validateToken}=require('../service/auth.js')


function checkForAuthenticaionCookie(cookieName){
  return (req,res,next)=>{
    try {
        const tokenCookieValue=req.cookies[cookieName];
        const userPayload=validateToken(tokenCookieValue);
        req.user=userPayload;
        next();
    } catch (error) {
        next();
    }
  }
}

module.exports={
    checkForAuthenticaionCookie,
}