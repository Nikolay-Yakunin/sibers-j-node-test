const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const NewSequelize = require('../../../../pkg/database/database');
const { NewUserRepository }  = require('../../repository');
const { NewUser } = require("../../user")

const normal = [
  "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_",
  "cqX3]c3jl8'y",
  "ДжонJosh",
  "ДжоновJoshv",
  "male",
  "2000-10-10"
]

const normal1 = [
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

  const user1 = NewUser(
    ...normal1
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

  describe("deleteUser", () => {
    test('deleteUser: normal', async () => {
      try {
        await repo.createUser(user, "hash");
        let res = await repo.deleteUser(1)
        expect(res).toBeUndefined()

      } catch (error) {
        expect(error).toBeNull()
      }
    });

    test('deleteUser: not exist', async () => {
      try {
        await repo.createUser(user1, "hash");
        await repo.deleteUser(1)

        let res = await repo.deleteUser(1)
        expect(res).toBeUndefined()

      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toBe('Record with ID=1 not found')
      }
    });

    test('deleteUser: not exist', async () => {
      try {
        await repo.deleteUser("1")
      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toBe('Invalid type: expected id=number, got a string')
      }
    });
  })
});
