const jwt = require("jsonwebtoken");

const authUser = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1]; // Assuming "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Token missing" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
        req.user = decodedToken;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token", error: error.message });
    }
};

module.exports = { authUser };
