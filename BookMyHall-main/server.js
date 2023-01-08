const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const mongodb = require("mongodb");
const client = mongodb.MongoClient;
const cors = require("cors");

const db_url = process.env.DB_URL;

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to BookMyHall Backend")
})

app.get("/rooms", async(req, res) => {
    try {
        let connection = await client.connect(db_url, { useUnifiedTopology: true });
        let db = connection.db("bookmyhall");
        let data = await db.collection("rooms").find().toArray();
        if (data) {
            res.status(200).json({ status: 200, data: data });
        } else {
            res.status(401).json({ status: 401 });
        }
        connection.close();
    } catch (error) {
        console.log("Error occured:", error)
        res.status(400).json({ status: 400 });
    }

})

app.get("/bookings", async(req, res) => {
    try {
        let connection = await client.connect(db_url, { useUnifiedTopology: true });
        let db = connection.db("bookmyhall");
        let data = await db.collection("bookings").find().toArray();
        if (data) {
            res.status(200).json({ status: 200, data: data });
        } else {
            res.status(401).json({ status: 401 });
        }
        connection.close();
    } catch (error) {
        console.log("error in posting bookings", error.message);
        res.status(401).json({ status: 401 });
    }
})

app.post("/rooms", async(req, res) => {
    try {
        let connection = await client.connect(db_url, { useUnifiedTopology: true });
        let db = connection.db("bookmyhall");
        let data = await db.collection("rooms").insertOne(req.body)
        if (data) {
            res.json({ status: 200, message: "insertion successfull" })
        } else {
            res.json({ status: 400, message: "insertion failed" })
        }
        connection.close();
    } catch (error) {
        console.log("error in posting rooms", error.message);
        res.status(401).json({ status: 401 });
    }

})

app.post("/bookings", async(req, res) => {
    try {
        let connection = await client.connect(db_url, { useUnifiedTopology: true });
        let db = connection.db("bookmyhall");
        let data = await db.collection("bookings").insertOne(req.body);
        if (data) {
            res.status(200).json({ status: 200, message: "Booking success" })
        } else {
            res.status(401).json({ status: 401, message: "Booking failed" })
        }
        connection.close();
    } catch (error) {
        console.log("error while posting booking", error.message);
        res.status(400).json({ status: 400, message: "Booking error" })
    }
})

app.listen(port, () => console.log(`Server running on port ${port}`))