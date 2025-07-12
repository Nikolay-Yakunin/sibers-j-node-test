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
  let createdUser;

  beforeAll(async () => {
    await db.sync({ force: true });
    repo = new BaseRepository(UserModel);

    createdUser = await repo.create({
      username: 'find_test_user',
      password: 'secure_hash',
    });
  });

  afterAll(async () => {
    await db.close();
  });

  describe("findById", () => {
    test('returns the correct user by ID', async () => {
      const found = await repo.findById(createdUser.id);

      expect(found).toEqual(
        // Explore this only here :(
        expect.objectContaining({
          id: createdUser.id,
          username: 'find_test_user',
          password: 'secure_hash',
        })
      );
    });

    test('returns null for non-existent ID', async () => {
      const found = await repo.findById(99999);
      expect(found).toBeNull();
    });

    test('returns plain object (not Sequelize instance)', async () => {
      const found = await repo.findById(createdUser.id);
      expect(found).not.toBeInstanceOf(Model); // important
      expect(typeof found).toBe('object');
    });

    // Good test
    test('does not mutate data when fetching', async () => {
      const found1 = await repo.findById(createdUser.id);
      const found2 = await UserModel.findByPk(createdUser.id);
      expect(found1.username).toBe(found2.username);
      expect(found1.password).toBe(found2.password);
    });
  })
});
