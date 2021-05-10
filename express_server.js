//SERVER DEPENDENCIES & VARIABLES
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
  "dhWui4": "http://www.bing.com"
};

//SERVER REQUESTS
app.post('/urls', (req, res) => {
  let newData = req.body;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = newData.longURL;

  res.redirect(301, '/urls');
  res.end();
});

app.post('/urls/:shortURL/delete', (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect(301, '/urls');
  res.end();
});

app.post('/urls/:shortURL/edit', (req, res) => {
  console.log("reach");
  let shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
  res.end();
});

//SERVER PAGES
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const dataVars = {urls: urlDatabase};
  res.render('urls_index', dataVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.get('/urls/:shortURL', (req, res) => {
  const dataVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  // res.redirect(dataVars.longURL);
  res.render('urls_show', dataVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = (length = 6) => {
  return Math.random().toString(20).substr(2, length);
};