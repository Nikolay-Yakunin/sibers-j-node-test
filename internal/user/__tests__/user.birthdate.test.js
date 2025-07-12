const NewUser = require('../user');
const { describe, expect, test } = require('@jest/globals');

const normal = {
  username: "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_",
  password: "cqX3]c3jl8'y",
  fname: "ДжонJosh",
  lname: "ДжоновJoshv",
  gender: "male",
  birthdate: "2000-10-10"
}

describe("NewUser", () => {
  /* ------------- Valid Values -------------*/
  describe("Birthdate: Valid Values", () => {
    test("Valid data: String 2004-03-10", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        "2004-03-10"
      ).getBrithdate()).toBe(
        "2004-03-10"
      )
    });
    test("Valid data: Date 2004-03-10", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        new Date("2004-03-10")
      ).getBrithdate()).toBe(
        "2004-03-10"
      )
    });
  });
  /* ------------- Invalid Types -------------*/
  describe("Brithdate: Invalid Types", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          123
        );
      }).toThrow(new TypeError("Invalid type: Expected type string or Date, got a number"));
    });

    test("Invalid type: Boolean", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          true
        );
      }).toThrow(new TypeError("Invalid type: Expected type string or Date, got a boolean"));
    });

    test("Invalid type: Object", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          {}
        );
      }).toThrow(new TypeError("Invalid type: Expected type string or Date, got a object"));
    });

    test("Invalid type: Null", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          null
        );
      }).toThrow(new TypeError("Invalid type: Expected type string or Date, got a object"));
    });

    test("Invalid type: Undefined", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          undefined,
        );
      }).toThrow(new TypeError("Invalid type: Expected type string or Date, got a undefined"));
    });
  })
  /* ------------- Invalid Values -------------*/
  describe("Brithdate: Invalid Values", () => {
    test("Invalid Value: Not ISO format", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          "10.04.2004"
        );
      }).toThrow(new Error("Invalid value: Invalid format, use ISO"));
    });


  });

})