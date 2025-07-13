const { NewUser }= require('../../user');
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
  /* ------------- Valid Data -------------*/
  describe("Username: Valid Data", () => {
    test("Valid data: Max username (39 chars)", () => {
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
    test("Valid data: Min length username (3 chars)", () => {
      const user = new NewUser(
        "abc",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("abc");
    });
    test("Valid data: Username with numbers", () => {
      const user = new NewUser(
        "user123",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("user123");
    });
    test("Valid data: Username with underscores", () => {
      const user = new NewUser(
        "user_name",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("user_name");
    });
    test("Valid data: Username with dashes", () => {
      const user = new NewUser(
        "user-name",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("user-name");
    });
    test("Valid data: Username with mixed case", () => {
      const user = new NewUser(
        "UserName",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("UserName");
    });
    test("Valid data: Complex valid username", () => {
      const user = new NewUser(
        "User_123-Name",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("User_123-Name");
    });
  })
  /* ------------- Invalid Types -------------*/
  describe("Username: Invalid Data", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new NewUser(
          123,
          normal.password,
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
          true,
          normal.password,
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
          {},
          normal.password,
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
          null,
          normal.password,
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
          undefined,
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new TypeError("Invalid type: Expected type string, got a undefined"));
    });
  })
  /* ------------- Invalid Data -------------*/
  describe("Invalid data", () => {
    test("Invalid value: Empty string", () => {
      expect(() => {
        new NewUser(
          "",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: Empty string"));
    });

    test("Invalid value: Too short (1 char)", () => {
      expect(() => {
        new NewUser(
          "a",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must be at least 3 characters"));
    });

    test("Invalid value: Too short (2 chars)", () => {
      expect(() => {
        new NewUser(
          "ab",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must be at least 3 characters"));
    });

    test("Invalid value: Too long (40 chars)", () => {
      expect(() => {
        new NewUser(
          "a".repeat(40),
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must be less than 40 characters"));
    });

    test("Invalid value: Contains spaces", () => {
      expect(() => {
        new NewUser(
          "user name",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username can only contain letters, numbers, underscore and dash"));
    });

    test("Invalid value: Contains special characters", () => {
      expect(() => {
        new NewUser(
          "user@name",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username can only contain letters, numbers, underscore and dash"));
    });

    test("Invalid value: Contains dots", () => {
      expect(() => {
        new NewUser(
          "user.name",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username can only contain letters, numbers, underscore and dash"));
    });

    test("Invalid value: Only numbers", () => {
      expect(() => {
        new NewUser(
          "123",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must contain at least one letter"));
    });

    test("Invalid value: Only underscores and dashes", () => {
      expect(() => {
        new NewUser(
          "_-_",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must contain at least one letter"));
    });

    test("Invalid value: Numbers with underscores/dashes but no letters", () => {
      expect(() => {
        new NewUser(
          "123_456",
          normal.password,
          normal.fname,
          normal.lname,
          normal.gender,
          normal.birthdate
        );
      }).toThrow(new Error("Invalid value: username must contain at least one letter"));
    });
  })
  /* ------------- Edge cases -------------*/
   describe("Edge cases", () => {
    test("Edge case: Exactly 3 characters with letter", () => {
      const user = new NewUser(
        "a12",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("a12");
    });

    test("Edge case: Exactly 39 characters", () => {
      const longName = "a" + "1".repeat(38); // 39 chars total
      const user = NewUser(
        longName,
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe(longName);
    });

    test("Edge case: Single letter at start", () => {
      const user = NewUser(
        "a__",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("a__");
    });

    test("Edge case: Single letter at end", () => {
      const user = NewUser(
        "123a",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("123a");
    });

    test("Edge case: Single letter in middle", () => {
      const user = NewUser(
        "12a34",
        normal.password,
        normal.fname,
        normal.lname,
        normal.gender,
        normal.birthdate
      );
      expect(user.getUserName()).toBe("12a34");
    });
  });
});