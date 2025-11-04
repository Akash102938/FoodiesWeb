import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';

const app = express();
const port = process.env.PORT || 4000

//MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//DATABASE
connectDB()

app.get('/', (req,res)=>{
    res.send('API WORKING')
})

app.listen(port, ()=>{
    console.log(`Server started on https://localhost:${port}`);
})