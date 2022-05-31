import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
// import dotenv from 'dotenv'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'

const app = express();
const CONNECTION_URL = "mongodb://admin:admin@cluster0-shard-00-00.t5qza.mongodb.net:27017,cluster0-shard-00-01.t5qza.mongodb.net:27017,cluster0-shard-00-02.t5qza.mongodb.net:27017/SocialMediaApp?ssl=true&replicaSet=atlas-5pdjfb-shard-0&authSource=admin&retryWrites=true&w=majority"
const PORT = process.env.port || 5001;
// dotenv.config();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/posts', postRoutes);
app.use('/user', userRoutes);


app.get('/',(req, res)=>{
res.send("App Is Running")
})



mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`server running on port : ${PORT}`))
  )
  .catch((error) => console.log(error.message));

//   mongoose.set('useFindAndModify', false);
