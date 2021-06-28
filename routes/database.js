var express = require("express");
var router = express.Router();

var fs = require("fs");

var database = {};
var file = fs.readFileSync("database.json");

if (file) {
    database = JSON.parse(file);
}

router.get("/hello", function (req, res, next) {
    res.send("Hello");
});

router.get("/*", function (req, res, next) {
    let response = JSON.parse(JSON.stringify(database));

    let noData = false;
    req.url.split("/").forEach((part) => {
        if (part != "") {
            let url, index;

            if (part.includes(":")) [url, index] = part.split(":");
            else url = part;

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

    const body = req.body;

    try {
        req.url.split("/").forEach((part) => {
            if (part != "") {
                let url, index;

                if (part.includes(":")) [url, index] = part.split(":");
                else url = part;

                if (response[url]) {
                    response = response[url];
                    dbQuery += `['${url}']`;

                    if (index)
                        if (response[index]) {
                            response = response[index];
                            dbQuery += `[${index}]`;
                        } else noData = true;
                } else noData = true;
            }
        });

        eval(`database${dbQuery} = body`);

        if (noData) {
            console.log("no data");
            res.status(400).json({ message: "No data available" });
        } else {
            res.json(database);
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: "Fatal error on the server" });
    }
});

module.exports = router;
