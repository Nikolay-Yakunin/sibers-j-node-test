const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const NewSequelize = require('../../../../pkg/database/database');
const { NewUserRepository }  = require('../../repository');
const { NewUser } = require("../../user")

const normal = [
  "cra",
  "cqX3]c3jl8'y",
  "Джон",
  "Джонович",
  "male",
  "2000-10-10"
]

const normal1 = [
  "cra1",
  "cqX3]c3jl8'y",
  "Николай",
  "Николаевич",
  "male",
  "2000-10-10"
]

const normal2 = [
  "cra2",
  "cqX3]c3jl8'y",
  "Николай",
  "Дмитривич",
  "female",
  "2000-10-10"
]

const normal3 = [
  "cra3",
  "cqX3]c3jl8'y",
  "Николай",
  "Дмитривич",
  "female",
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

  const user2 = NewUser(
    ...normal2
  )

  const user3 = NewUser(
    ...normal3
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

  describe("findAllUsers", () => {
    test('findAllUsers: normal', async () => {
      try {
        await repo.createUser(user, "hash");
        await repo.createUser(user1, "hash");
        await repo.createUser(user2, "hash");

        const raw = await repo.findAllUsers();
        // console.log(raw)
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(3)
        expect(raw.rows.length).toBe(3)
        } catch (error) {
        // console.log(error)
        expect(error).toBeNull()
      }
    });

    test('findAllUsers: not exist', async () => {
      try {
        const raw = await repo.findAllUsers({ where: "not_exist" });
        // console.log(raw)
        expect(raw).toBeNull();
      } catch (error) {
        expect(error).not.toBeNull()
      }
    });

    test('findAllUsers: where simple', async () => {
      try {
        const raw = await repo.findAllUsers({ search: "Николай" });
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(2)
        expect(raw.rows.length).toBe(2)
        expect(raw.rows[0].first_name).toBe("Николай")
        expect(raw.rows[1].first_name).toBe("Николай")
        // console.log(raw)
      } catch (error) {
        expect(error).toBeNull()
      }
    });

    test('findAllUsers: where complex', async () => {
      try {
        const raw = await repo.findAllUsers({ limit: 1, search: "Николай" });
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(2)
        expect(raw.rows.length).toBe(1)
        expect(raw.rows[0].first_name).toBe("Николай")
        expect(raw.rows[0].gender).toBe("male")
        // console.log(raw)
      } catch (error) {
        expect(error).toBeNull()
      }
    });

    test('findAllUsers: where simple and limit', async () => {
      try {
        const raw = await repo.findAllUsers({ limit: 3, search: "female" });
        // console.log(raw)
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(1) // That just now much 'where' items, not actual count
        expect(raw.rows.length).toBe(1)
        expect(raw.rows[0].first_name).toBe("Николай")
        // console.log(raw)
      } catch (error) {
        // console.log(error)
        expect(error).toBeNull()
      }
    });

    test('findAllUsers: search emty field', async () => {
      try {
        const raw = await repo.findAllUsers({ limit: 3, search: "" });
        // console.log(raw)
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(3) // That just now much 'where' items, not actual count
        expect(raw.rows.length).toBe(3)
        expect(raw.rows[0].first_name).toBe("Джон")
        // console.log(raw)
      } catch (error) {
        // console.log(error)
        expect(error).toBeNull()
      }
    });

    test('findAllUsers: where simple and limit and offset', async () => {
      try {
        await repo.createUser(user3, "hash")
        let raw = await repo.findAllUsers({ limit: 2, offset: 0, search: "Николай"  });
        // console.log(raw)
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(3)
        expect(raw.rows.length).toBe(2)
        expect(raw.rows[0].first_name).toBe("Николай")
        expect(raw.rows[1].first_name).toBe("Николай")
        raw = await repo.findAllUsers({ limit: 2, offset: 2, search: "Николай" });
        //console.log('2\n', raw)
        expect(raw).not.toBeNull();
        expect(raw.count).toBe(3)
        expect(raw.rows.length).toBe(1)
        expect(raw.rows[0].first_name).toBe("Николай")
      } catch (error) {
        // console.log(error)
        expect(error).toBeNull()
      }
    });
  })
});
