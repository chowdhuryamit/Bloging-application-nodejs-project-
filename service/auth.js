const jwt=require('jsonwebtoken');
const secret='blogingWebsiteByAmitChowdhury';

function createToken(user){
   return jwt.sign({
      fullName:user.fullName,
      _id:user._id,
      email:user.email,
      profileImage:user.profileImg,
      role:user.role,
   },secret);
}

function validateToken(token){
   const payload=jwt.verify(token,secret);
   return payload;
}

module.exports={
    createToken,
    validateToken,
}