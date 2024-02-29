//MAIN FILE FOR THE BACKEND
//Run this file with "npm start"

import express from "express";
import cors from "cors";    //Helps connect the backend and the frontend
import dotenv from "dotenv";

import { VerifyToken } from "../middleware/VerifyToken.js";
import userRoutes from "../routes/userRoutes.js";

const app = express();  //Declaring the express app

dotenv.config();

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;  //Backup port if 5001 isn't available

app.use("/api/users", userRoutes);

app.get("/", async (req, res) => {
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});