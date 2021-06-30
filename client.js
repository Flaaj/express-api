const fetch = require("node-fetch");
// const body = [];
const body = { name: "a name", age: 20, email: "email@gmail.com" };

fetch("http://localhost:3000/db/users", {
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
