const userModel = require("../models/users");
const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    const authorizationToken = req.headers.authorization;
    try 
    {
        const decodedToken = jwt.verify(authorizationToken, process.env.JWT_PASSWORD);
        req.user = decodedToken;
        next();
    } 
    catch (error) 
    {
        next(error);
    }
}

module.exports= { authUser }