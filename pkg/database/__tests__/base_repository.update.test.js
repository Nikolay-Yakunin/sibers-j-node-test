const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const { DataTypes, Model } = require('sequelize');
const BaseRepository = require('../base_repository');
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
      username: 'update_test_user1',
      password: 'secure_hash',
    });

    createdUser2 = await repo.create({
      username: 'update_test_user2',
      password: 'secure_hash',
    });
  });

  afterAll(async () => {
    await db.close();
  });

  describe("Update", () => {
    test('update normal', async () => {
      const found = await repo.update(createdUser1.id, { username: 'after_test_user1' });

      expect(found).toEqual(

        expect.objectContaining({
          id: createdUser1.id,
          username: 'after_test_user1',
          password: 'secure_hash',
        })
      );
    });

    test('update non exist', async () => {
      await expect(
        repo.update(3, { username: 'after_test_user1' })
      ).rejects.toThrow('Record with ID=3 not found');
    });

    test('updated username is not unique', async () => {
      await expect(
        repo.update(createdUser1.id, { username: createdUser2.username })
      ).rejects.toThrow("Validation error");
    });

    test('returns plain object (not Sequelize instance)', async () => {
      const found = await repo.update(createdUser1.id, { username: "1123" });
      expect(found).not.toBeInstanceOf(Model); // important
      expect(typeof found).toBe('object');
    });
  })
});
