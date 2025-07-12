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
  describe("LastName: Valid Data", () => {
    test("Valid data: LastName Min Length and latin", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Jo",
        normal.gender,
        normal.birthdate
      ).getLastName()).toBe(
        "Jo"
      )
    });
    test("Valid data: LastName Big Length and kirilic", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Вольфшлегельштайнхаузенбергедорф",
        normal.gender,
        normal.birthdate
      ).getLastName()).toBe(
        "Вольфшлегельштайнхаузенбергедорф"
      )
    });
    test("Valid data: LastName with apostrophes", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Вольфшлегельштайнхаузенбергедор'ф",
        normal.gender,
        normal.birthdate
      ).getLastName()).toBe(
        "Вольфшлегельштайнхаузенбергедор'ф"
      )
    });
    test("Valid data: LastName with space", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Вольфшлегельштайнх аузенбергедор'ф",
        normal.gender,
        normal.birthdate
      ).getLastName()).toBe(
        "Вольфшлегельштайнх аузенбергедор'ф"
      )
    });
  })
  /* ------------- Inalid Types -------------*/
  describe("LastName: Invalid Data", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          normal.password,
          normal.fname,
          123,
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
          normal.fname,
          true,
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
          normal.fname,
          {},
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
          normal.fname,
          null,
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
          normal.fname,
          undefined,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a undefined"));
    });
  })
  /* ------------- Inalid Values -------------*/
  describe("LastName: Invalid Values", () => {
    test("Invalid Values: Empty string", () => {
      expect(() => new NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Empty string"));
    });
    test("Invalid Values: Contains numbers", () => {
      expect(() => new NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Jo1",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name can only contain letters, spaces, and apostrophes"));
    });
    test("Invalid Values: Contains special charactesr", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "Jo!🤔",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name can only contain letters, spaces, and apostrophes"));
    });
    test("Invalid Values: Contains apostrof on start", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "'j",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name cannot start or end with apostrophe"));
    });
    test("Invalid Values: Contains apostrof on end", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "j'",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name cannot start or end with apostrophe"));
    });
  })
  /* ------------- Edge Cases -------------*/
  describe("LastName: Edge Cases", () => {
    test("Edge Cases: LastName less that Min Length", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "J",
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name must be at least 2 characters"))
    });
    test("Edge Cases: LastName more that Max Length", () => {
      expect(() => NewUser(
        normal.username,
        normal.password,
        normal.fname,
        "J".repeat(51),
        normal.gender,
        normal.birthdate
      )).toThrow(new Error("Invalid value: Name must be less than 50 characters"))
    });
  })
})