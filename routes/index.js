var express = require('express');
var router = express.Router();
const fs = require("fs");

const dbName = "database.json";
const file = fs.readFileSync(dbName);
const uuid = require("uuid");
const uid = uuid.v4;

let db = {};
if (file) {
    db = JSON.parse(file);
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
