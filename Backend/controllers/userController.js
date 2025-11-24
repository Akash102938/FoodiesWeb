import userModel from "../modals/userModel.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import validator from 'validator'


//LOGIN FUNCTION
const loginUser = async (req,res)=>{
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "User doesn't exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const token = createToken(user._id);
        res.json({success: true, token})
    } catch (error) {
        console.log(error);
        res.json({success: false, messsage: 'Error'})
    }
}

//CREATE A TOKEN
const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
}

//REGISTER FUNCTION
const registerUser= async(req,res)=>{
    const {username, password, email} = req.body;

    try {
        const exists = await userModel.findOne({email})
        if(exists){
            return res.status(400).json({
                success: false,
                message: "User alreadt exists"
            })
        }

        //VALIDATION
        if(!validator.isEmail(email)){
            return res.json({success: false, message: 'Please enter a valid email'})
        }

        if(!password || password.length < 8){
            return res.json({success: false, message: "Please enter a stronger password (min 8 chars)"})
        }

        // hash password (using bcryptjs sync helpers for simplicity)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //NEW USER
        const newUser= new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        
        res.json({success: true, token})
    } catch (error) {
       console.log(error);
        res.json({success: false, message: 'Error'}) 
        
    }
}
export {loginUser, registerUser}