//SERVER DEPENDENCIES & VARIABLES
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const {findIDByLogin, findURLS, findUserByEmail, findUserByID, generateRandomString, currentDate} = require('./helpers');

const PORT = 8080;
const urlDatabase = {};
const users = {};

//MIDDLEWARE
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

//SERVER REQUESTS
app.post('/urls', (req, res) => {
  const newData = req.body.longURL;
  const userID = req.session.user_id;
  const shortURL = generateRandomString();
  const date = currentDate();
  console.log(date);

  urlDatabase[shortURL] = { longURL: newData, userID: userID, created: date };

  res.redirect(301, '/urls');
  res.end();
});

//url deletes
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];

  res.redirect(301, '/urls');
  res.end();
});

//url edits
app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;

  res.redirect(`/urls/${shortURL}/edit`);
  res.end();
});

//updating edited url
app.post('/:shortURL/updateURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const newURL = req.body.newURL;
  const currentID = req.session.user_id;
  const date = currentDate();

  urlDatabase[shortURL] = { longURL: newURL, userID: currentID, created: date };

  res.redirect(`/urls`);
  res.end();
});

//login requests
app.post('/login', (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  const id = findIDByLogin(user, password, users);

  if (!id) {
    res.statusMessage = 'Not found';
    res.status(403).end();
  } else {
    req.session.user_id = id;
    res.redirect(301, `/urls`).end();
  }
});

//logout requests
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect(301, `/login`).end();
});

//registration requests
app.post('/register', (req, res) => {
  const user = req.body.username;
  const email = req.body.email;
  const id = generateRandomString();
  const hashPass = bcrypt.hashSync((req.body.password), 10);
  const alreadyUser = findUserByEmail(email, users);

  if (!email || !hashPass || alreadyUser) {
    res.status(400).end();
  } else {
    req.session.user_id = id;
  
    users[user] = { id: id, email: email, password: hashPass};
    res.redirect(301, `/urls`).end();
  }
});

//SERVER PAGES
app.get('/', (req, res) => {
  const currentID = req.session.user_id;

  if (!currentID) {
    res.redirect('/login').end();
  } else {
    res.redirect('/urls').end();
  }
});

//login
app.get('/login', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const dataVars = { email: userData.email };

  res.render(`urls_login`, dataVars);
});

//register new user
app.get('/register', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const dataVars = { id: userData.id, email: userData.email, password: userData.password };

  res.render(`urls_register`, dataVars);
});

//create new link
app.get('/newlink', (req, res) => {
  const userID = req.session.user_id;
  const dataVars = findUserByID(userID, users);
  
  if (!userID) {
    res.redirect('/login').end();
  } else {
    res.render('urls_new', dataVars);
  }
  res.end();
});

//home page
app.get('/urls', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const userURLS = findURLS(currentUser, urlDatabase);
  const dataVars = { id: userData.id, email: userData.email, urls: userURLS };

  res.render('urls_index', dataVars);
});

//url editing
app.get('/urls/:shortURL/edit', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const shortURL = req.params.shortURL;
  const dataVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, email: userData.email };

  res.render('urls_show', dataVars);
});

//redirection to long urls
app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  if (longURL) {
    res.redirect(longURL).end;
  } else {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});