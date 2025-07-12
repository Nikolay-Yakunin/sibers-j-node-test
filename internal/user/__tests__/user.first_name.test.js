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
  /* ------------- Valid Values -------------*/
  describe("FirstName: Valid Data", () => {
    test("Valid data: FirstName Min Length and latin", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        "Jo",
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getFirstName()).toBe(
        "Jo"
      )
    });
    test("Valid data: FirstName Big Length and kirilic", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        "Вольфшлегельштайнхаузенбергедорф",
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getFirstName()).toBe(
        "Вольфшлегельштайнхаузенбергедорф"
      )
    });
    test("Valid data: FirstName with apostrophes", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        "Вольфшлегельштайнхаузенбергедор'ф",
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getFirstName()).toBe(
        "Вольфшлегельштайнхаузенбергедор'ф"
      )
    });
    test("Valid data: FirstName with space", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        "Вольфшлегельштайнх аузенбергедор'ф",
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getFirstName()).toBe(
        "Вольфшлегельштайнх аузенбергедор'ф"
      )
    });
  })
  /* ------------- Inalid Types -------------*/
  describe("FirstName: Invalid Data", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          123,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a number"));
    });

    test("Invalid type: Boolean", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          true,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a boolean"));
    });

    test("Invalid type: Object", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          {},
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a object"));
    });

    test("Invalid type: Null", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          null,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a object"));
    });

    test("Invalid type: Undefined", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          undefined,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a undefined"));
    });
  })
  /* ------------- Inalid Values -------------*/
  describe("FirstName: Invalid Values", () => {
    test("Invalid Values: Empty string", () => {
      expect(() => new NewUser(
        normal.username,
        normal.password,
        "",
        normal.lname,
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Empty string"));
    });
    test("Invalid Values: Contains numbers", () => {
      expect(() => new NewUser(
        normal.username,
        normal.password,
        "Jo1",
        normal.lname,
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name can only contain letters, spaces, and apostrophes"));
    });
    test("Invalid Values: Contains special charactesr", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        "Jo!🤔",
        normal.lname,
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name can only contain letters, spaces, and apostrophes"));
    });
  })
  /* ------------- Edge Cases -------------*/
  describe("FirstName: Edge Cases", () => {
    test("Edge Cases: FirstName less that Min Length", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        "J",
        normal.lname,
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name must be at least 2 characters"))
    });
    test("Edge Cases: FirstName more that Max Length", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        "J".repeat(51),
        normal.lname,
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name must be less than 50 characters"))
    });
  })
})