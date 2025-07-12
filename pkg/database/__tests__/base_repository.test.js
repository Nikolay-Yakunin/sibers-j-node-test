const { describe, expect, test } = require('@jest/globals');
const BaseRepository = require("../base_repository")

// I dont wana make mock, maybe later

describe("BaseRepository", () => {
  describe("Model: Invalid Data", () => {
    test("Invalid type: Number", () => {
      expect(() => {
        new BaseRepository(
          123
        );
      }).toThrow(new TypeError("Invalid type: Expected sequelize.Model, got a number"));
    });

    test("Invalid type: Boolean", () => {
      expect(() => {
        new BaseRepository(
          true
        );
      }).toThrow(new TypeError("Invalid type: Expected sequelize.Model, got a boolean"));
    });

    test("Invalid type: Object", () => {
      expect(() => {
        new BaseRepository(
          {}
        );
      }).toThrow(new TypeError("Invalid type: Expected sequelize.Model, got a object"));
    });

    test("Invalid type: Null", () => {
      expect(() => {
        new BaseRepository(
          null
        );
      }).toThrow(new TypeError("Invalid type: Expected sequelize.Model, got a object"));
    });

    test("Invalid type: Undefined", () => {
      expect(() => {
        new BaseRepository(
          undefined,
        );
      }).toThrow(new TypeError("Invalid type: Expected sequelize.Model, got a undefined"));
    });
  })
})