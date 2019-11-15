"use strict";

const express = require('express');
const fs = require('fs');
const MongoClient = require("mongodb").MongoClient;
const version = "1.4.0";
// Read config
const config = JSON.parse(fs.readFileSync("server.json", "utf-8"));

// Exit if port or mongoDB connection string is not defined
if (!config.hasOwnProperty("mongo") || !config.hasOwnProperty("port")) {
    console.error("Wrong server configuration");
    process.exit(1);
}

// MongoDB variables
const mongoUrl = config.mongo;
// Try to connect to MongoDB
const mongoClient = new MongoClient(mongoUrl, {useNewUrlParser: true});
mongoClient.connect(function (err, client) {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log("Connected to " + mongoUrl.replace(/:[^:]+@/, ':******@'));
        db = client.db("storage");
        storageCollection = db.collection("entry");
    }
});
let db, storageCollection;

// Create express server with json parser and public directory
const app = express();
const port = config.port;
app.use(express.json());
app.use(express.static('public'));

// Display server information
app.get('/info', (req, res) => res.status(200).json({message: `REST.js ${version}`}));

// Get all items from storage
app.get('/storage', (req, res) => {
    storageCollection.find().toArray(function (err, result) {
        res.status(200).json(result === null ? [] : result);
    });
});

// Get item by key
app.get('/storage/:key', (req, res) => {
    storageCollection.find({key: req.params.key}).toArray(function (err, result) {
        if (result === null || result.length === 0) {
            res.status(404).json({message: `Key "${req.params.key}" not found`});
        } else {
            res.status(200).json(result[0]);
        }
    });
});

// Add new item to the storage
app.post('/storage', (req, res) => {
    if (req.hasOwnProperty("body") && req.body !== null && req.body.hasOwnProperty("key") && req.body.hasOwnProperty("value")) {
        storageCollection.find({key: req.body.key}).toArray(function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                if (result.length === 0) {
                    storageCollection.insertOne({key: req.body.key, value: req.body.value}, function (err, result) {
                        if (err) {
                            res.status(500).json(err);
                        } else {
                            res.status(200).json({message: `Key "${req.body.key}" successfully added`});
                        }
                    });
                } else {
                    res.status(304).json({message: `Key "${req.body.key}" exists`});
                }
            }
        });
    } else {
        res.status(412).json({message: "Wrong body or key"});
    }
});

// Update item by key
app.put('/storage', (req, res) => {
    if (req.hasOwnProperty("body") && req.body !== null && req.body.hasOwnProperty("key") && req.body.hasOwnProperty("value")) {
        storageCollection.updateOne({key: req.body.key}, {$set: {value: req.body.value}}, function (err, result) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json({message: `Key "${req.body.key}" successfully updated`});
            }
        });
    } else {
        res.status(412).json({message: "Wrong body or key"});
    }
});

// Delete item from storage
app.delete('/storage/:key', (req, res) => {
    storageCollection.deleteOne({key: req.params.key}, function (err, result) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json({message: `Key "${req.params.key}" successfully deleted`});
        }
    });
});

// Start serving
app.listen(port, () => console.log(`REST.js ${version} listening on port ${port}`));