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

const users = {
  nick: {
    id: 'hdh3g4',
    email: 'nasd@gmail.com',
    password: 'Crazymoving1',
    urls: { 'bxiiahdw': 'www.google.com'}
  }
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
  const password = req.body.password;
  const id = findIDByName(user, password);

  res.cookie('user_id', id);
  res.redirect(301, `/urls`);
  res.end();
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect(301, `/urls`);
  res.end();
});

app.post('/register', (req, res) => {
  const user = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const id = generateRandomString();
  res.cookie('user_id', id);

  users[user] = {id: id, email: email, password: password, urls: {}}
  res.redirect(301, `/urls`);
  res.end();
});

//SERVER PAGES
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls', (req, res) => {
  const currentUser = req.cookies.user_id;
  const userData = findUserByID(currentUser);
  const variables = {id: userData.id, email: userData.email, password: userData.password, urls: userData.urls}
  res.render('urls_index', variables);
});

app.get('/urls/new', (req, res) => {;
  const currentUser = req.cookies.user_id;
  res.render('urls_new', {username: currentUser});
});

app.get('/urls/:shortURL', (req, res) => {
  const currentUser = req.cookies.user_id;
  const dataVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username: currentUser};
  res.render('urls_show', dataVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = (length = 6) => {
  return Math.random().toString(20).substr(2, length);
};

const findUserByID = (currentID) => {
  let empty = {};
  for (let user in users) {
    if (users[user].id === currentID){
      return users[user];
    }
  }
  return empty;
};

const findIDByName = (user, password) => {
  for (let name in users) {
    if (name === user) {
      if (users[name].password === password) {
        return users[name].id;
      }
    }
  }
}