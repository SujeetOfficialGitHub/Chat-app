const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const {Op, Sequelize} = require('sequelize')


const signup = async(req, res) => {
    // console.log(req.body)
    try {
        const {name, email, password1, password2} = req.body;

        // Check password and confirm  password 
        if (password1 !== password2){
            return res.status(400).json({message: "Password and confirm doesn't match"})
        }

        // Validate input fields 
        if (!name || !email || !password1){
            return res.status(400).json({message: 'Missing required fields'})
        }

        // Check existingUser user 
        const existingUser = await User.findOne({where: {email}})
        if (existingUser){
            return res.status(400).json({message: 'User already exists'});
        }

        // Hashing password 
        const hashed_password = await bcrypt.hash(password1.toString(), 10);

        // Creating user 
        await User.create({
            name,
            email,
            password: hashed_password
        })
        res.status(201).json({message: 'Signup successfully'})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}
const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        // Validate input fields 
        if (!email || !password){
            return res.status(400).json({message: 'Invalid email or password'})
        }

        // Check user 
        const user = await User.findOne({where: {email}});
        if (!user){
            return res.status(400).json({message: "User doesn't exists"})
        };
       
        // Validate password from database 
        const matched_password = await bcrypt.compare(password, user.password);
        // console.log(matched_password)
        if (!matched_password){
            return res.status(400).json({message: "Invalid email or password"});
        };

        // Create token 
        const token = jwt.sign({id: user.id, user: user.name, email: user.email}, process.env.SECRET_KEY);
        res.status(200).json({message: 'Login successfully', token})

    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Internal server error"})
    }

}
const allUsers = async (req, res) => {
    const keyword = req.query.search
    ? {
        [Op.or]: [
          { name: { [Op.like]: `%${req.query.search}%` } },
        ],
      }
    : {};

    try {
        const users = await User.findAll({
            where: {
              [Op.and]: [
                keyword,
                { id: { [Op.ne]: req.user.id } },
              ],
            },
        });
      
        res.status(200).json({ users });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
};
  

module.exports = {
    signup,
    login,
    allUsers
}
