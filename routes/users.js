const express = require("express");
const router = express.Router();
const fs = require("fs");

const dbName = "database.json";
const file = fs.readFileSync(dbName);
const uuid = require("uuid");
const uid = uuid.v4;

let db = {};
if (file) {
    db = JSON.parse(file);
}

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.status(200).json(db.users);
});

router.get("/:uid", function (req, res, next) {
    try {
        const uid = req.params.uid;
        console.log(uid)
        const user = db.users.find((user) => user.id == uid);
        res.status(200).json(user);
    } catch (err) {console.log(err)}
});

router.post("/", function (req, res, next) {
    const body = req.body;
    const newUser = { id: uid(), ...body };
    db.users.push(newUser);
    fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));

    res.status(201).json(newUser);
});

router.put("/::uid", function (req, res, next) {
    const body = req.body;
    let updatedUser = {};
    let foundUser = false;
    db.users = db.users.map((user) => {
        if (user.id == req.params.uid) {
            updatedUser = { ...user, ...body };
            foundUser = true;
            return updatedUser;
        } else return user;
    });
    if (foundUser) {
        console.log(updatedUser);
        res.status(200).json(updatedUser);
    } else {
        const newUser = { id: uid(), ...body };
        db.users.push(newUser);
        res.status(201).json(newUser);
    }
    fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
});

router.patch("/::uid", function (req, res, next) {
    const body = req.body;
    let updatedUser = {};
    let foundUser = false;
    db.users = db.users.map((user) => {
        if (user.id == req.params.uid) {
            updatedUser = { ...user, ...body };
            foundUser = true;
            return updatedUser;
        } else return user;
    });
    if (foundUser) {
        res.status(200).json(updatedUser);
        fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
    } else {
        res.status(404).json({ message: "No user with given ID" });
    }
});

router.delete("/::uid", function (req, res, next) {
    let deletedUser = {};
    let foundUser = false;
    db.users = db.users.filter((user) => {
        if (user.id == req.params.uid) {
            foundUser = true;
            deletedUser = user;
            return false;
        } else return true;
    });
    fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
    foundUser ? res.status(200).json(deletedUser) : res.status(400).json({ message: "No user with given ID" });
});

module.exports = router;
