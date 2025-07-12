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

const userData = {
  username: 'test_user',
  password: 'hashed_password',
};

describe('BaseRepository', () => {
  let repo;

  // Init db
  beforeAll(async () => {
    await db.sync({ force: true });
    repo = new BaseRepository(UserModel);
  });

  // Close db | Like defer in Go
  afterAll(async () => {
    await db.close();
  });

  describe("create",() => {
    test('create(): creates a new record and returns plain object', async () => {
    const created = await repo.create(userData);

    expect(created).toEqual(
      expect.objectContaining({
        username: 'test_user',
        password: 'hashed_password',
      })
    );

    const raw = await UserModel.findOne({ where: { username: 'test_user' } });
    expect(raw).not.toBeNull();
    expect(raw.username).toBe('test_user');
  });
  })
});
