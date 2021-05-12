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

module.exports = {findIDByLogin, findURLS, findUserByEmail, findUserByID};