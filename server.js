import express, { response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const CLIENT_SECRET = "e93ae0084407968880ba10597836f46c7a7066fb";

const CLIENT_ID = "Ov23liOZBgb8s4RKzXCu";

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/getAccessToken", async function (req, res) {
  console.log(req.query.code);
  const params =
    "?client_id=" +
    CLIENT_ID +
    "&client_secret=" +
    CLIENT_SECRET +
    "&code=" +
    req.query.code;

  await fetch("https://github.com/login/oauth/access_token" + params, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      return res.json(data);
    });
});

app.get("/getUserData", async function (req, res) {
  req.get("Authorization"); // Bearer ACCESSTOKEN

  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: req.get("Authorization"),
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

app.listen(4000, function () {
  console.log("CORS server running on port 4000");
});
