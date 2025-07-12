const NewUser = require('../user');
const { describe, expect, test } = require('@jest/globals');

const normal = {
  username: "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_",
  password: "cqX3]c3jl8'y",
  fname: "ДжонJosh",
  lname: "ДжоновJoshv",
  gender: "male",
  birthdate: "01.01.2000"
}


describe("NewUser", () => {
  test("Valid data: Max username", () => {
    expect(NewUser(
      normal.username,
      normal.password,
      normal.fname,
      normal.lname,
      normal.gender,
      normal.birthdate
    ).getUserName()).toBe(
      "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_"
    )
  });
});