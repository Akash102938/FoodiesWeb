import mongoose from 'mongoose'

export const connectDB = async () =>  {
   const uri = process.env.MONGO_URI || 'mongodb+srv://akashjordan399_db_user:akashjordan123@cluster0.ekaimes.mongodb.net/?retryWrites=true&w=majority'

   try {
      await mongoose.connect(uri, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         serverSelectionTimeoutMS: 5000,
      })

      console.log('✅ DB CONNECTED')
   } catch (err) {
      console.error('❌ MongoDB connection error:', err.message || err)
      throw err
   }
}