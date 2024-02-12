//MAIN FILE FOR THE BACKEND
//Run this file with "npm start"

import express from "express";
import cors from "cors";    //Helps connect the backend and the frontend
import dotenv from "dotenv";

import { VerifyToken } from "../middleware/VerifyToken.js";

const app = express();  //Declaring the express app

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;  //Backup port if 5001 isn't available

app.get("/", (req, res) => {
    res.send("working fine");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});