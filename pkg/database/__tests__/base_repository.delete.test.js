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
      username: 'delete_test_user1',
      password: 'secure_hash',
    });

    createdUser2 = await repo.create({
      username: 'delete_test_user2',
      password: 'secure_hash',
    });
  });

  afterAll(async () => {
    await db.close();
  });

  describe("delete", () => {
    test('delete normal', async () => {
      const found = await repo.delete(createdUser1.id);

      const check = await repo.findAll({ where: { username: createdUser1.username } })

      expect(found).toBeNull;
      expect(check).toBeNull
    });

    test('delete normal', async () => {
      expect(repo.delete(3)).rejects.toThrow("Record with ID=3 not found");
    });
  })
});
