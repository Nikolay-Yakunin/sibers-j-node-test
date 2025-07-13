const { NewUser } = require('../../user');
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
  describe("Gender: Valid Values", () => {
    test("Valid data: male", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getGender()).toBe(
        "male"
      )
    });
    test("Valid data: female", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        "female",
        normal.birthdate
      ).getGender()).toBe(
        "female"
      )
    });
    test("Valid data: other", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        "other",
        normal.birthdate
      ).getGender()).toBe(
        "other"
      )
    });
  });
  /* ------------- Invalid Types -------------*/
  describe("Gender: Invalid Types", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          123,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a number"));
    });

    test("Invalid type: Boolean", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          true,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a boolean"));
    });

    test("Invalid type: Object", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          {},
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a object"));
    });

    test("Invalid type: Null", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          null,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a object"));
    });

    test("Invalid type: Undefined", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          undefined,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a undefined"));
    });
  })
  /* ------------- Invalid Values -------------*/
  describe("Gender: Invalid value", () => {
    test("Invalid value: Empty string", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          "",
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Empty string"))
    });
    test("Invalid value: Not a male || female || other", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          normal.lname,
          "cat",
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: must be male or female or other"))
    });
  });
});