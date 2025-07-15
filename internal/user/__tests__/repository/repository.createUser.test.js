const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const NewSequelize = require('../../../../pkg/database/database');
const { NewUserRepository } = require('../../repository');
const { NewUser } = require("../../user")

const normal = [
  "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_",
  "cqX3]c3jl8'y",
  "ДжонJosh",
  "ДжоновJoshv",
  "male",
  "2000-10-10"
]

// Need npm install --save sqlite3
const db = NewSequelize('sqlite::memory:');

describe('BaseRepository', () => {
  let repo;
  const user = NewUser(
    ...normal
  )

  // Init db
  beforeAll(async () => {
    repo = NewUserRepository(db);
    await db.sync({ force: true });
  });

  // Close db | Like defer in Go
  afterAll(async () => {
    await db.close();
  });

  describe("createUser", () => {
    test('createUser: normal', async () => {
      const created = await repo.createUser(user, "hash");

      expect(created).toEqual(
        expect.objectContaining({
          username: normal[0],
          password: 'hash',
        })
      );

      const raw = await repo.findUserById(1);
      expect(raw).not.toBeNull();
      expect(raw.username).toBe('AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_');
    });

    test('createUser: error add the same twice', async () => {
      try {
        await repo.createUser(user, "hash");
        throw new Error("Expected error but got success");
      } catch (err) {
        expect(err.message).toMatch("Validation error");
      }
    });

    test('createUser: error not user', async () => {
      try {
        await repo.createUser({}, "hash");
        throw new Error("Expected error but got success");
      } catch (err) {
        expect(err.message).toMatch("Invalid type: user must be User");
      }
    });

    test('createUser: error ', async () => {
      try {
        // Just dont initiate create
        await repo.createUser(user, 123); // I dont wanna do this for all types
        throw new Error("Expected error but got success");
      } catch (err) {
        expect(err.message).toMatch("Invalid type: expected string, got a number");
      }
    });
  })
});
