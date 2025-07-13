const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const NewSequelize = require('../../../../pkg/database/database');
const NewUserRepository = require('../../repository');
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

      let raw = await repo.updateUser(1, { first_name: "имя_upd" })
      // console.log(raw)
      
      expect(raw).not.toBeNull()
      expect(raw.count).toBeUndefined()
      expect(raw.first_name).toBe("имя_upd")
    });

    test('Update: not unicue', async () => {
      try {
        const created = await repo.createUser(user1, "hash");

        let raw = await repo.updateUser(2, { username: "user" })
        // console.log(raw)
        
        expect(raw).toBeNull()
      } catch (error) {
        expect(error).not.toBeNull()
        expect(error.message).toMatch("Validation error")
      }
    });

    test('Update: not unicue', async () => {
      try {
        let raw = await repo.updateUser(2, { username: "user1" })
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
        expect(error.message).toBe("Record with ID=1 not found or field not exist") // unexpected, but okey
      }
    });
  })
});
