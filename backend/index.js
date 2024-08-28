import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { MongoClient } from "mongodb";

const app = express();

app.get("/", (req, res) => {
    res.send("QuizzyPals backend is up and running at: http://localhost:4000...");
});

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect()
            .then(() => {
                app.listen(process.env.PORT, () => {
                    console.log(`Listening on port ${process.env.PORT}...`);
                });
            })
            .catch((error) => {
                console.log(error);
            });
