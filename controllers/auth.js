import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Register User
export var register = async (req,res)=>{

    try {
        //de-stucturing the date from the requested frontend
        var {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        }=req.body;

        //salting  and hashing the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password : passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile : Math.floor(Math.random() * 1000),
            impressions : Math.floor(Math.random() * 1000)
        });

        const savedUser  = await newUser.save();
        //sending the data as a json format. 201 --> created
        res.status(201).json(savedUser);
    } catch (error) {
        //error in case the http doesn't recognize the function implementation.
        res.status(500).json({error : error.message});
    }
}

//Login  User

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};