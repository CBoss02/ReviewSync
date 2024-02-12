import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { VerifyToken } from "../middleware/VerifyToken.js";

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(VerifyToken);

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("working fine");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});