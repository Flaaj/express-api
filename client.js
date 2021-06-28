const fetch = require("node-fetch");
const body = { field1: "value1", field2: "value2", field3: "value3" };

fetch("http://localhost:3000/db/arr", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
})
    .then((resp) => resp.json())
    .then((data) => {
        console.log(data);
    })
    .catch((err) => console.log(err));
