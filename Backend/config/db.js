import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://akashjordan399_db_user:mithu123@cluster0.ekaimes.mongodb.net/Foodieweb')
    .then(()=> console.log('DB CONNECTED'))
}