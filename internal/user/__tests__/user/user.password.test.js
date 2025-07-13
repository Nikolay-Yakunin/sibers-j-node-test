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
  describe("Password: Valid Values", () => {
    test("Valid data: Password Min Length", () => {
      expect(NewUser(
        normal.username,
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getPassword()).toBe(
        "cqX3]c3jl8'y"
      )
    });
    test("Valid data: Password Max Length", () => {
      expect(NewUser(
        normal.username,
        "y@0uRZ888?/8Y$/k\tR$.$hwICxEN{\"Hytl`!g'GGt.BZ4zZd;",
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      ).getPassword()).toBe(
        "y@0uRZ888?/8Y$/k\tR$.$hwICxEN{\"Hytl`!g'GGt.BZ4zZd;"
      )
    });
  }
  )
  /* ------------- Invalid Types -------------*/
  describe("Password: Invalid Data", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          123,
          normal.fname,
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
          true,
          normal.fname,
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
          {},
          normal.fname,
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
          null,
          normal.fname,
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
          undefined,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a undefined"));
    });
  })
  /* ------------- Invalid Values -------------*/
  describe("Password: Invalid value", () => {
    test("Invalid value: Empty string", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Empty string"))
    });
    test("Invalid value: Don't have a lowercase letter", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "ABCDEFG1234!",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Password must contain at least one lowercase letter"))
    });
    test("Invalid value: Don't have a uppercase letter", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "abcdefg1234!",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Password must contain at least one uppercase letter"))
    });
    test("Invalid value: Don't nave a number", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "Abcdefg!@#$%",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Password must contain at least one number"))
    });
    test("Invalid value: Don't nave a special character", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "ABCDefg12345",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Password must contain at least one special character"))
    });
    // 🤔 
    test("Invalid value: Have a invalid symbol", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "🤔ABCDefg1234!",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Password contains invalid characters"))
    });
  })
  /* ------------- Edge cases -------------*/
  describe("Password: Edge cases", () => {
    test("Invalid value: More that Max length", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "y@0uRZ888?/8Y$/k\tR$.$hwICxEN{\"Hytl`!g'GGt.BZ4zZd;11",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Max length is 50"))
    })
    test("Invalid value: Less that Min length", () => {
      expect(() => {
        new NewUser(
          normal.username,
          "y@0uRZ888?/",
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Min length is 12"))
    })
  })
})