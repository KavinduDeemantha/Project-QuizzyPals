import dotenv from 'dotenv';
dotenv.config();

import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("QuizzyPals backend is up and running at: http://localhost:4000...");
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});
