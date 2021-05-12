const { assert } = require('chai');

const { findIDByLogin, findURLS, findUserByEmail, findUserByID } = require('../helpers.js');

const testUsers = {
  nick: {
    id: 73623,
    email: "nick@hotmail.com",
    password: "purple-monkey-dinosaur"
  },
  jared: {
    id: 866723,
    email: "jared@example.com",
    password: "dishwasher-funk"
  }
};

describe('findUserByEmailTest', function () {
  it('should return true if a user email exists', function () {
    const userExists = findUserByEmail("jared@example.com", testUsers)
    assert.isTrue(userExists, "Found a match!");
  });

  it('should return false if a user email does not exists', function () {
    const userExists = findUserByEmail("emily@example.com", testUsers)
    assert.isFalse(userExists, "Couldn't find user");
  });
});

describe('findUserByID test', function () {
  it('should return the users object name given the current id', function () {
    const userID = findUserByID(73623, testUsers)
    assert.deepEqual(userID, {
      id: 73623,
      email: "nick@hotmail.com",
      password: "purple-monkey-dinosaur"
    }
    )
  })

  it('should return empty object if current ID does not exist', function () {
    const userID = findUserByID(73624, testUsers)
    assert.deepEqual(userID, {});
  })

});