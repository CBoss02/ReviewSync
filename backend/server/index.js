import express from "express";
import cors from "cors";    //Helps connect the backend and the frontend
import dotenv from "dotenv";

import userRoutes from "../routes/userRoutes.js";
import VerifyToken from "../middleware/VerifyToken.js";
import companyRoutes from "../routes/companyRoutes.js";



import documentRoutes from "../routes/documentRoutes.js";

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


const PORT = process.env.PORT || 8080;  //Backup port if 5001 isn't available

app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

//Left in from merge request with edit roles
//app.use("/api/documents", documentRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});