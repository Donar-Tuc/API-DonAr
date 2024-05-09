const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

usersSchema.pre("save", async function (next) {

    const user = this;

    if (!user.isModified('password')) return next();

    try
    {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    }
    catch(error)
    {
        next(error);
    }
})

const Users = mongoose.model('Users', usersSchema, "Users");

module.exports = Users;
