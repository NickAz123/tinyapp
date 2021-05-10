//SERVER DEPENDENCIES & VARIABLES
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require(`cookie-parser`);
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');

const urlDatabase = {
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
  let shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}`);
  res.end();
});

app.post('/login', (req, res) => {
  const user = req.body.username;
  res.cookie('username', user);
  res.redirect(301, `/urls`);
  res.end();
});

app.post('/logout/:username', (req, res) => {
  res.clearCookie('username');
  res.redirect(301, `/urls`);
  res.end();
});

//SERVER PAGES

app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const currentUser = req.cookies.username;
  const dataVars = {username: currentUser, urls: urlDatabase};
  res.render('urls_index', dataVars);
});

app.get('/urls/new', (req, res) => {;
  const currentUser = req.cookies.username;
  res.render('urls_new', {username: currentUser});
});

app.get('/urls/:shortURL', (req, res) => {
  const currentUser = req.cookies.username;
  const dataVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: currentUser};
  res.render('urls_show', dataVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = (length = 6) => {
  return Math.random().toString(20).substr(2, length);
};