var express = require("express");
var router = express.Router();

var fs = require("fs");

var databaseName = "database.json";
var database = {};
var file = fs.readFileSync(databaseName);

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

    try {
        req.url.split("/").forEach((part) => {
            if (part != "") {
                let url, index;
                [url, index] = part.split(":");

                if (response[url]) {
                    response = response[url];
                    dbQuery += `['${url}']`;
                    if (index == "p") {
                        if (Array.isArray(response)) {
                            response.push(body)
                            body = response
                        } 
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
        res.status(400).json({ message: "Fatal error on the server" });
    }
});

module.exports = router;
