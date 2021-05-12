const bcrypt = require('bcrypt');

const findUserByID = (currentID, users) => {
  let empty = {};
  for (let user in users) {
    if (users[user].id === currentID) {
      return users[user];
    }
  }
  return empty;
};

const findIDByLogin = (user, password, users) => {
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

const findUserByEmail = (email, users) => {
  for (let name in users) {
    if (users[name].email === email) {
      return true;
    }
  }
  return false;
};

const findURLS = (id, urlDatabase) => {
  let urls = {};
  for (let surls in urlDatabase) {
    if (urlDatabase[surls].userID === id) {
      urls[surls] = { longURL: urlDatabase[surls].longURL, created: urlDatabase[surls].created};
    }
  }
  return urls;
};

const generateRandomString = (length = 6) => {
  return Math.random().toString(20).substr(2, length);
};

const currentDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}/${month}/${year}`
}

module.exports = {findIDByLogin, findURLS, findUserByEmail, findUserByID, generateRandomString, currentDate};