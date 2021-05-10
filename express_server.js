//Server Dependencies, Imports and Global Variables
const express = require("express");
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "dhWui4": "http://www.bing.com"
};

//Server Pages
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get('/urls', (req, res) => {
  const dataVars = {urls: urlDatabase};
  res.render("urls_index", dataVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const dataVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  console.log(req.params);
  res.render("urls_show", dataVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});