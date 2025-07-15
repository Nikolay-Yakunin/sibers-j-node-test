const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const NewSequelize = require('../../../../pkg/database/database');
const { NewUserRepository }  = require('../../repository');
const { NewUser } = require("../../user")

const normal = [
  "user",
  "cqX3]c3jl8'y",
  "Имя",
  "Фамилия",
  "male",
  "2000-10-10"
]

const normal1 = [
  "user1",
  "cqX3]c3jl8'y",
  "Имя",
  "Фамилия",
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

  describe("Update", () => {
    test('Update: normal', async () => {
      const created = await repo.createUser(user, "hash");
      let useru = NewUser(...normal)
      useru.setFirstName("имяup'd")

      let raw = await repo.updateUser(1, useru)
      // console.log(raw)

      expect(raw).not.toBeNull()
      expect(raw.count).toBeUndefined()
      expect(raw.first_name).toBe("имяup'd")
    });

    test('Update: not unicue', async () => {
      try {
        const created = await repo.createUser(user1, "hash");

        let useru = NewUser(...normal1)
        useru.setUserName("user")

        let raw = await repo.updateUser(2, useru)
        // console.log(raw)

        expect(raw).toBeNull()
      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toMatch("Validation error")
      }
    });

    test('Update: change on the same', async () => {
      try {
        let raw = await repo.updateUser(2, user1)
        // console.log(raw)

        expect(raw).not.toBeNull()
        expect(raw.username).toBe("user1")
      } catch (error) {
        expect(error).toBeNull()
      }
    });

    test('Update: id not number', async () => {
      try {
        let raw = await repo.updateUser("1", { username: "user1" })
        // console.log(raw)

        expect(raw).toBeNull()
      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toBe("Invalid type: expected id=number, got a string")
      }
    });

    test('Update: non exist fild', async () => {
      try {
        // console.log(await repo.findAllUsers())
        await repo.updateUser(1, { kukoracha: "user1" })
        // console.log(raw)

        expect(raw).toBeNull()
      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toBe("Invalid type: user must be User") // unexpected, but okey
      }
    });
  })
});
