const fetch = require("node-fetch");
// const body = { name: "an another name", age: 21, email: "email@gmail.com" };
const body = {
    user1: "3d1864d5-10e7-48a1-80d0-48ae57d5867e",
    user2: "c83ab878-de69-4d1e-bc37-79f9b1d7ff4d",
    hobbies: ["ski", "mountains", "photography"],
};

fetch("http://localhost:3000/users/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
})
    .then((resp) => resp.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
