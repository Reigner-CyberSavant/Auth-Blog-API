const jwt = require("jsonwebtoken");

//Create a token to prevent user from signing out, send verification code and verify verification code.
//Note that this identifier will be called in the "authRouter.js" file in the above respective routes.

exports.identifier = (req, res, next) => {
    let token;
    if (req.headers.client === 'not-browser') {
        token = req.headers.authorization;
    } else {
        token = req.cookies['Authorization'];
    } 

    if (!token){
        return res.status(403).json({success: false, message: 'Unauthorized'});
    }

    try {
        const userToken = token.split(' ')[1];
        const jwtVerified = jwt.verify(userToken, process.env.JWT_SECRET);//or TOKEN_SECRET);
        
            if(jwtVerified){
                req.user = jwtVerified;
                next();
            }else{
                throw new Error ('Token Error');
            }
    } catch (error) {
        console.log(error);
    }
}