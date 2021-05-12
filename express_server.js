//SERVER DEPENDENCIES & VARIABLES
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require(`cookie-parser`);
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
  console.log(newData);
  const userID = req.cookies.user_id;
  // const user = findNameByID(userID);

  const shortURL = generateRandomString();
  // users[user].urls[shortURL] = newData.longURL;
  urlDatabase[shortURL] = { longURL: newData, userID: userID };
  res.redirect(301, '/urls');
  res.end();
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const userID = req.cookies.user_id;

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
  const id = findIDByLogin(user, password);

  if (!id) {
    res.status(403);
    res.end();
  } else {
    res.cookie('user_id', id);
    res.redirect(301, `/urls`);
    res.end();
  };
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect(301, `/login`);
  res.end();
});

app.post('/register', (req, res) => {
  const user = req.body.username;
  const email = req.body.email;
  const hashPass = bcrypt.hashSync((req.body.password), 10);
  const id = generateRandomString();

  const alreadyUser = findUserByEmail(email);

  if (!email || !hashPass || alreadyUser) {
    res.status(400);
    res.end();
  } else {
    res.cookie('user_id', id);

    users[user] = { id: id, email: email, password: hashPass}
    console.log(users);
    res.redirect(301, `/urls`);
    res.end();
  }
});

//SERVER PAGES
app.get('/login', (req, res) => {
  const currentUser = req.cookies.user_id;
  const userData = findUserByID(currentUser);
  const variables = { id: userData.id, email: userData.email, password: userData.password };
  res.render(`urls_login`, variables);
});

app.get('/register', (req, res) => {
  const currentUser = req.cookies.user_id;
  const userData = findUserByID(currentUser);
  const variables = { id: userData.id, email: userData.email, password: userData.password };

  res.render(`urls_register`, variables);
});

app.get('/new', (req, res) => {
  const userID = req.cookies.user_id;
  const dataVars = findUserByID(userID);
  if (!userID) {
    res.redirect('/login');
    res.end();
  } else {
    res.render('urls_new', dataVars);
  }
});

app.get('/urls', (req, res) => {
  const currentUser = req.cookies.user_id;
  const userData = findUserByID(currentUser);
  const userURLS = findURLS(currentUser);
  const variables = { id: userData.id, email: userData.email, password: userData.password, urls: userURLS };
  console.log(variables);

  res.render('urls_index', variables);
});

app.get('/urls/:shortURL/edit', (req, res) => {
  const currentUser = req.cookies.user_id;
  const userData = findUserByID(currentUser);
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

//FUNCTIONS
const generateRandomString = (length = 6) => {
  return Math.random().toString(20).substr(2, length);
};

const findUserByID = (currentID) => {
  let empty = {};
  for (let user in users) {
    if (users[user].id === currentID) {
      return users[user];
    }
  }
  return empty;
};

const findIDByLogin = (user, password) => {
  for (let name in users) {
    if (name === user) {
      const passCheck = bcrypt.compareSync(password, users[name].password);
      if (passCheck) {
        return users[name].id;
      }
    }
  }
  return false;
};

const findUserByEmail = (email) => {
  for (let name in users) {
    if (users[name].email === email) {
      return true;
    }
  }
  return false;
};

const findURLS = (id) => {
  let urls = {}
  for (let surls in urlDatabase) {
    if (urlDatabase[surls].userID === id) {
      urls[surls] = { longURL: urlDatabase[surls].longURL }
    }
  }
  return urls;
};