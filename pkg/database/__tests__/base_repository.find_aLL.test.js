const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const { DataTypes, Model } = require('sequelize');
const { BaseRepository } = require('../base_repository');
const NewSequelize = require('../database');

// Need npm install --save sqlite3
const db = NewSequelize('sqlite::memory:');

class UserModel extends Model { }

UserModel.init(
  {
    username: {
      type: DataTypes.STRING(39),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 39],
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Hashed password',
    },
  },
  {
    sequelize: db,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    underscored: true, // for first_name and last_name 
  }
);

describe('BaseRepository', () => {
  let repo;
  let createdUser1;
  let createdUser2;

  beforeAll(async () => {
    await db.sync({ force: true });
    repo = new BaseRepository(UserModel);

    createdUser1 = await repo.create({
      username: 'find_all_test_user1',
      password: 'secure_hash',
    });
    createdUser2 = await repo.create({
      username: 'find_all_test_user2',
      password: 'secure_hash',
    });
  });

  afterAll(async () => {
    await db.close();
  });

  describe("findAll", () => {
    test('returns all users', async () => {
      const found = await repo.findAll({ raw: true });

      const expectedUsernames = [createdUser1.username, createdUser2.username];
      const actualUsernames = found.rows.map(u => u.username);

      expect(actualUsernames.sort()).toEqual(expectedUsernames.sort());
    });

    test('rerutn oly one', async () => {
      const found = await repo.findAll({ limit: 1, raw: true });

      const expectedUsernames = [createdUser1.username];
      const actualUsernames = found.rows.map(u => u.username);

      expect(actualUsernames.sort()).toEqual(expectedUsernames.sort());
    });

    test('rerutns start 1', async () => {
      const found = await repo.findAll({ offset: 1, raw: true });

      const expectedUsernames = [createdUser2.username];
      const actualUsernames = found.rows.map(u => u.username);

      expect(actualUsernames.sort()).toEqual(expectedUsernames.sort());
    });

    test('rerutns where usrname "find_all_test_user2"', async () => {
      const found = await repo.findAll({ where: { username: 'find_all_test_user2' }, raw: true });

      const expectedUsernames = [createdUser2.username];
      const actualUsernames = found.rows.map(u => u.username);

      expect(actualUsernames.sort()).toEqual(expectedUsernames.sort());
    });

    test('returns plain object (not Sequelize instance)', async () => {
      const found = await repo.findAll();
      expect(found).not.toBeInstanceOf(Model); // important
      expect(typeof found).toBe('object');
    });
  })
});
