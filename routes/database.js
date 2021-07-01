var express = require("express");
var router = express.Router();

var fs = require("fs");

const dbName = "database.json";
const file = fs.readFileSync(dbName);
const uuid = require("uuid");
const uid = uuid.v4;

let db = {};
if (file) {
    db = JSON.parse(file);
}

router.get("/", function (req, res, next) {
    res.json(db);
});

router.get("/:key", function (req, res, next) {
    const key = req.params.key;
    res.status(200).json(db[key]);
});

router.get("/:key/::uid", function (req, res, next) {
    const uid = req.params.uid;
    const key = req.params.key;
    console.log(key);
    const elem = db[key].find((elem) => elem.id == uid);
    res.status(200).json(elem);
});

router.post("/:key/", function (req, res, next) {
    try {
        const body = req.body;
        const key = req.params.key;
        console.log(db[key]);
        const newElem = { id: uid(), ...body };
        db[key].push(newElem);
        console.log(db[key]);
        fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));

        res.status(201).json(newElem);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

router.put("/:key/:uid", function (req, res, next) {
    try {
        const body = req.body;
        const key = req.params.key;
        let updatedElem = {};
        let foundElem = false;
        db[key] = db[key].map((elem) => {
            if (elem.id == req.params.uid) {
                updatedElem = { ...elem, ...body };
                foundElem = true;
                return updatedElem;
            } else return elem;
        });
        if (foundElem) {
            console.log(updatedElem);
            res.status(200).json(updatedElem);
        } else {
            const newElem = { id: uid(), ...body };
            db[key].push(newElem);
            res.status(201).json(newElem);
        }
        fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

router.patch("/:key/:uid", function (req, res, next) {
    try {
        const body = req.body;
        const key = req.params.key;
        let updatedElem = {};
        let foundElem = false;
        db[key] = db[key].map((elem) => {
            if (elem.id == req.params.uid) {
                updatedElem = { ...elem, ...body };
                foundElem = true;
                return updatedElem;
            } else return elem;
        });
        if (foundElem) {
            res.status(200).json(updatedElem);
            fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
        } else {
            res.status(404).json({ message: `No element with given ID in '${key}'` });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

router.delete("/:key/:uid", function (req, res, next) {
    try {
        const key = req.params.key;
        let deletedElem = {};
        let foundElem = false;
        db[key] = db[key].filter((elem) => {
            if (elem.id == req.params.uid) {
                foundElem = true;
                deletedElem = elem;
                return false;
            } else return true;
        });
        fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
        foundElem
            ? res.status(200).json(deletedElem)
            : res.status(400).json({ message: `No element with given ID in '${key}'` });
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });
    }
});

module.exports = router;

// router.get("/*", function (req, res, next) {
//     let response = JSON.parse(JSON.stringify(db));

//     let noData = false;
//     req.url.split("/").forEach((part) => {
//         if (part != "") {
//             let url, index;
//             [url, index] = part.split(":");

//             if (response[url]) {
//                 response = response[url];
//                 if (index)
//                     if (response[index]) response = response[index];
//                     else noData = true;
//             } else noData = true;
//         }
//     });
//     if (noData) {
//         console.log("no data");
//         res.status(400).send({ message: "No data available" });
//     } else {
//         res.json(response);
//     }
// });

// router.post("/*", function (req, res, next) {
//     let response = JSON.parse(JSON.stringify(db));
//     let noData = false;

//     let dbQuery = "";

//     let body = req.body;
//     let add = {};
//     let addQuery = "";
//     let first = true;
//     let respSent = false;

//     try {
//         req.url.split("/").forEach((part, i) => {
//             if (part != "") {
//                 let url, index;
//                 [url, index] = part.split(":");

//                 if (response[url]) {
//                     response = response[url];
//                     dbQuery += `['${url}']`;
//                     if (Array.isArray(response) && req.url.split("/").length - 1 == i) {
//                         response.push({ id: uid(), ...body });
//                         body = response;
//                     } else if (index)
//                         if (response[index]) {
//                             response = response[index];
//                             dbQuery += `[${index}]`;
//                         } else noData = true;
//                 } else {
//                     if (first) eval(`add${addQuery} = {...response}`);
//                     else eval(`add${addQuery} = {}`);
//                     addQuery += `['${url}']`;
//                     first = false;
//                 }
//             }
//         });
//         eval(`add${addQuery} = body`);
//         eval(`db${dbQuery} = add`);

//         if (noData) {
//             console.log("no data");
//             res.status(400).json({ message: "No data available" });
//         } else {
//             fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
//             res.json(db);
//         }
//     } catch (err) {
//         console.log(err);
//         !respSent && res.status(400).json({ message: "Fatal error on the server" });
//     }
// });

// router.delete("/*", function (req, res, next) {
//     let response = JSON.parse(JSON.stringify(db));
//     let noData = false;
//     let respSent = false;
//     let dbQuery = "";
//     let isArray = false;
//     let indexToDelete = null;
//     try {
//         req.url.split("/").forEach((part, i) => {
//             if (part != "") {
//                 let url, index;
//                 [url, index] = part.split(":");

//                 if (response[url]) {
//                     response = response[url];
//                     dbQuery += `['${url}']`;
//                     if (index)
//                         if (i == req.url.split("/").length - 1 && Array.isArray(response)) {
//                             isArray = true;
//                             indexToDelete = index;
//                         } else if (response[index]) {
//                             response = response[index];
//                             dbQuery += `[${index}]`;
//                         } else noData = true;
//                 } else noData = true;
//             }
//         });
//         if (isArray) eval(`db${dbQuery} = db${dbQuery}.filter((_, i) => i != ${indexToDelete})`);
//         else eval(`db${dbQuery} = undefined`);

//         if (noData) {
//             console.log("no data");
//             res.status(400).json({ message: "No data available" });
//         } else {
//             fs.writeFile(dbName, JSON.stringify(db), "utf8", (err) => console.log(err));
//             res.json(db);
//         }
//     } catch (err) {
//         console.log(err);
//         !respSent && res.status(400).json({ message: "Fatal error on the server" });
//     }
// });
