import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import  dotenv from 'dotenv';
import multer from 'multer';
import helmet from "helmet";
import morgan from "morgan";
//to access related paths of other files.
import path from "path";
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import { register } from './controllers/auth.js';
import {createPost} from "./controllers/posts.js"
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { verifyTokens } from './middleware/auth.js';
import User from './models/User.js';
import Post from './models/Post.js';
import { users , posts } from "./data/index.js";
dotenv.config();

// configurations --middlewares -- 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This line creates an instance of the Express.js framework, which helps in building web applications.
const app=express();
// This line enables parsing of JSON data in the incoming requests, allowing access to the data through req.body in subsequent code.
app.use(express.json());
// This line adds security HTTP headers to the response, helping to protect the application from common web vulnerabilities.
app.use(helmet());
// This line sets the Cross-Origin Resource Policy (CORP) to "cross-origin," allowing cross-origin access to resources.
app.use(helmet.crossOriginResourcePolicy({policy : "cross-origin"}));
// This line configures the morgan middleware to log HTTP request details in the console. The "common" parameter specifies the log format.
app.use(morgan("common"));
// This line uses the bodyParser middleware to parse incoming JSON requests with a maximum size of 30 megabytes and extended options enabled.
app.use(bodyParser.json({limit : "30mb" , extended : true}));
// This line uses the bodyParser middleware to parse URL-encoded requests with a maximum size of 30 megabytes and extended options enabled.
app.use(bodyParser.urlencoded({limit : "30mb", extended : true}));
// This line enables Cross-Origin Resource Sharing (CORS), allowing requests from different origins to access the application's resources.
app.use(cors());
// This line serves static files located in the public/assets directory when the path starts with "/assets". It allows accessing static assets like images, CSS files, etc., in the browser.
app.use("/assets", express.static(path.join(__dirname,'public/assets')));

//FIle Storage
const storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,"public/assets");
    },
    filename : (req,file,cb)=>{
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

//routes with file -- for authentication and authorization 
//register --> controller
app.post("/auth/register",upload.single("picture"),register);
app.post("/posts",verifyTokens,upload.single("picture"),createPost);

//routes
app.use("/auth",authRoutes);

app.use('/users',userRoutes);
app.use('/posts',postRoutes);

//database setup
const PORT = process.env.PORT || 6001;
// mongoose.set('strictQuery', true);
mongoose.connect(process.env.URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT , ()=>console.log("Server is working at "+PORT));

    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error)=>console.log(error + "did not connect"));

