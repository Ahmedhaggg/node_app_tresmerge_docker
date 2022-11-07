let express = require("express");
let mongoose = require("mongoose");
let { createClient } = require("redis");
let app = express();

let REDIS_PORT = 6379;
let REDIS_HOST = "redis"
let redisClient = createClient({ url: `redis://${REDIS_HOST}:${REDIS_PORT}`});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on("connect", () => console.log("redis connection successfully"));

redisClient.connect();

let DB_USER = 'root'
let DB_PASS = 'example'
let DB_HOST =  "mongo" //'172.21.0.2'
let DB_PORT = "27017"

mongoose
    .connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}`)
    .then(() => console.log("database connecting"))
    .catch(() => console.log("connection error"));

app.get("/", async (req, res, next) => {
    let users = await redisClient.get("users")
    res.json({
        users
    });
})
app.get("/data", (req, res, next) => {
    redisClient.set("users", `[{ name: "ahmed", age: 19}, { name: "ali", age: 12}]`)
    res.redirect("/");
});

app.listen(4000, () => console.log("server is ruuning"));
  