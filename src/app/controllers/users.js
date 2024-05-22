const userModel  = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
    try {
        const listAll = await userModel.find({})
        res.send({ list: listAll});
    }
    catch(error)
    {
        next(error);
    }
};

const login = async (req, res, next) => {
    try 
    {
        const { email, password } = req.body;

        if(!email || !password)
        {
            res.status(400).send({ message: "Please provide email and password to proceed." });
        }

        const user = await userModel.findOne({ email: email });
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!user || !passwordMatch)
        {
            res.status(400).send({ message: "Please provide valid credentials." });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_PASSWORD, { expiresIn: "1h" });

        res.send({ token: token });
    } 
    catch (error) 
    {
        next(error);
    }
};

const register = async (req, res, next) => {
    try 
    {
        const {userName, email, password } = req.body;

        const createUser = await userModel.create({
            userName,
            email,
            password
        });

        res.send({"register success": createUser});
    } 
    catch (error) 
    {
        next(error);
    }
}

module.exports = { login, register, getUsers }
