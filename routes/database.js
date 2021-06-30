var express = require("express");
var router = express.Router();

var fs = require("fs");

const databaseName = "database.json";
let database = {};
const file = fs.readFileSync(databaseName);
const uuid = require("uuid");
const uid = uuid.v4;

if (file) {
    database = JSON.parse(file);
}

router.get("/*", function (req, res, next) {
    let response = JSON.parse(JSON.stringify(database));

    let noData = false;
    req.url.split("/").forEach((part) => {
        if (part != "") {
            let url, index;
            [url, index] = part.split(":");

            if (response[url]) {
                response = response[url];
                if (index)
                    if (response[index]) response = response[index];
                    else noData = true;
            } else noData = true;
        }
    });
    if (noData) {
        console.log("no data");
        res.status(400).send({ message: "No data available" });
    } else {
        res.json(response);
    }
});

router.post("/*", function (req, res, next) {
    let response = JSON.parse(JSON.stringify(database));
    let noData = false;

    let dbQuery = "";

    let body = req.body;
    let add = {};
    let addQuery = "";
    let first = true;
    let respSent = false;

    try {
        req.url.split("/").forEach((part, i) => {
            if (part != "") {
                let url, index;
                [url, index] = part.split(":");

                if (response[url]) {
                    response = response[url];
                    dbQuery += `['${url}']`;
                    if (Array.isArray(response) && req.url.split("/").length - 1 == i) {
                        response.push({ id: uid(), ...body });
                        body = response;
                    } else if (index)
                        if (response[index]) {
                            response = response[index];
                            dbQuery += `[${index}]`;
                        } else noData = true;
                } else {
                    if (first) eval(`add${addQuery} = {...response}`);
                    else eval(`add${addQuery} = {}`);
                    addQuery += `['${url}']`;
                    first = false;
                }
            }
        });
        eval(`add${addQuery} = body`);
        eval(`database${dbQuery} = add`);

        if (noData) {
            console.log("no data");
            res.status(400).json({ message: "No data available" });
        } else {
            fs.writeFile(databaseName, JSON.stringify(database), "utf8", (err) => console.log(err));
            res.json(database);
        }
    } catch (err) {
        console.log(err);
        !respSent && res.status(400).json({ message: "Fatal error on the server" });
    }
});

router.delete("/*", function (req, res, next) {
    let response = JSON.parse(JSON.stringify(database));
    let noData = false;
    let respSent = false;
    let dbQuery = "";
    let isArray = false;
    let indexToDelete = null;
    try {
        req.url.split("/").forEach((part, i) => {
            if (part != "") {
                let url, index;
                [url, index] = part.split(":");

                if (response[url]) {
                    response = response[url];
                    dbQuery += `['${url}']`;
                    if (index)
                        if (i == req.url.split("/").length - 1 && Array.isArray(response)) {
                            isArray = true;
                            indexToDelete = index;
                        } else if (response[index]) {
                            response = response[index];
                            dbQuery += `[${index}]`;
                        } else noData = true;
                } else noData = true;
            }
        });
        if (isArray) eval(`database${dbQuery} = database${dbQuery}.filter((_, i) => i != ${indexToDelete})`);
        else eval(`database${dbQuery} = undefined`);

        if (noData) {
            console.log("no data");
            res.status(400).json({ message: "No data available" });
        } else {
            fs.writeFile(databaseName, JSON.stringify(database), "utf8", (err) => console.log(err));
            res.json(database);
        }
    } catch (err) {
        console.log(err);
        !respSent && res.status(400).json({ message: "Fatal error on the server" });
    }
});

module.exports = router;
