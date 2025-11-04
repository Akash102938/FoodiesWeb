import userModel from "../modals/userMode";
import jwt from 'jsonwebtoken'
import bcrypt from 'brcypt'
import validator from 'validator'

//LOGIN FUNCTION
const loginUSer = async (req,res)=>{
    const [email, password] = req.body

    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success: false, messsage: "User Doesn't Exitsts"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, messsage: 'Invalid Creds'})
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
    return jwt.sign({id}, process.env.JWT_SECRET)
}

//REGISTER FUNCTION
const register= async(req,res)=>{
    const {username, password, email} = req.body;

    try {
        const exits = await userModel.findOne({email})
        if(exits){
            return res.json({success: false, messsage: 'User Already Exits'})
        }

        //VALIDATION
        if(!validator.isEmail(email)){
            return res.json({success: false, messsage: 'Please Enter a Valid Email'})
        }

        if(password.length<0){
            return res.json({success: false, messsage: "Please Enter a Strong Password"})
        }
    } catch (error) {
        
    }
}