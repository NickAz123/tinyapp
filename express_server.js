//SERVER DEPENDENCIES & VARIABLES
const express = require('express');
const cookieSession = require('cookie-session');
const app = express();
const {findIDByLogin, findURLS, findUserByEmail, findUserByID, generateRandomString} = require('./helpers');
const PORT = 8080;
// const cookieParser = require(`cookie-parser`);
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.set('view engine', 'ejs');

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" },
  biiahdw: { longURL: "https://www.google.com", userID: 'hdh3g4' },
  hukj28: { longURL: "https://www.facebook.com", userID: 'hdh3g4' }
};

const users = {};

//SERVER REQUESTS
app.post('/urls', (req, res) => {
  const newData = req.body.longURL;
  const userID = req.session.user_id;
  // const user = findNameByID(userID);

  const shortURL = generateRandomString();
  // users[user].urls[shortURL] = newData.longURL;
  urlDatabase[shortURL] = { longURL: newData, userID: userID };
  res.redirect(301, '/urls');
  res.end();
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;

  delete urlDatabase[shortURL];
  res.redirect(301, '/urls');
  res.end();
});

app.post('/urls/:shortURL/edit', (req, res) => {
  let shortURL = req.params.shortURL;
  res.redirect(`/urls/${shortURL}/edit`);
  res.end();
});

app.post('/login', (req, res) => {
  const user = req.body.username;
  const password = req.body.password;
  const id = findIDByLogin(user, password, users);

  if (!id) {
    res.status(403);
    res.end();
  } else {
    req.session.user_id = id;
    res.redirect(301, `/urls`);
    res.end();
  };
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect(301, `/login`);
  res.end();
});

app.post('/register', (req, res) => {
  const user = req.body.username;
  const email = req.body.email;
  const hashPass = bcrypt.hashSync((req.body.password), 10);
  const id = generateRandomString();

  const alreadyUser = findUserByEmail(email, users);

  if (!email || !hashPass || alreadyUser) {
    res.status(400);
    res.end();
  } else {
    req.session.user_id = id;
  
    users[user] = { id: id, email: email, password: hashPass}
    res.redirect(301, `/urls`);
    res.end();
  }
});

//SERVER PAGES
app.get('/login', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const variables = { id: userData.id, email: userData.email, password: userData.password };
  res.render(`urls_login`, variables);
});

app.get('/register', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const variables = { id: userData.id, email: userData.email, password: userData.password };

  res.render(`urls_register`, variables);
});

app.get('/newlink', (req, res) => {

  const userID = req.session.user_id;
  const dataVars = findUserByID(userID, users);
  
  if (!userID) {
    console.log("reach");
    res.redirect('/login');
    res.end();
  } else {
    res.render('urls_new', dataVars);
  }
  res.end();
});

app.get('/urls', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const userURLS = findURLS(currentUser, urlDatabase);
  const variables = { id: userData.id, email: userData.email, password: userData.password, urls: userURLS };

  res.render('urls_index', variables);
});

app.get('/urls/:shortURL/edit', (req, res) => {
  const currentUser = req.session.user_id;
  const userData = findUserByID(currentUser, users);
  const shortURL = req.params.shortURL;
  const dataVars = { shortURL: shortURL, longURL: urlDatabase[shortURL].longURL, username: currentUser, email: userData.email };

  res.render('urls_show', dataVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);
  res.end();
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});