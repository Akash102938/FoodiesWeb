import mongoose from 'mongoose'

export const connectDB = async () =>  {
   const uri = process.env.MONGODB_URL

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