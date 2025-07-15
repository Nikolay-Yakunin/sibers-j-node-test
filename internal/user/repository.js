const { BaseRepository } = require("../../pkg/database/base_repository");
const { User } = require("./user");
const initUserModel = require("./model");

const { Op } = require('sequelize');

class UserRepository extends BaseRepository {
  async createUser(user, passwordHash) {
    if (!(user instanceof User)) {
      throw new TypeError("Invalid type: user must be User");
    }
    if (typeof (passwordHash) != 'string') {
      throw new TypeError(`Invalid type: expected string, got a ${typeof passwordHash}`)
    }

    const dto = {
      username: user.getUserName(),
      password: passwordHash,
      first_name: user.getFirstName(),
      last_name: user.getLastName(),
      gender: user.getGender(),
      birthdate: user.getBirthdate()
    };

    return await this.create(dto);
  }

  async findUserById(id) {
    if (typeof (id) != 'number') {
      throw new TypeError(`Invalid type: expected number, got a ${typeof id}`)
    }

    return await this.findById(id)
  }

  // Bad practic, can't check type options
  async findAllUsers(options = {}) {
    const { search, limit, offset, order } = options;

    const where = {};

    if (search) {
      const value = search.trim();
      where[Op.or] = [
        { username: { [Op.like]: `%${value}%` } },
        { first_name: { [Op.like]: `%${value}%` } },
        { last_name: { [Op.like]: `%${value}%` } },
        { gender: { [Op.like]: `%${value}%` } },
      ];
    }

    return await this.findAll({
      limit,
      offset,
      order,
      where,
    });
  }

  // Also can't check updates
  async updateUser(id, user, passwordHash) {
    if (typeof (id) != 'number') {
      throw new TypeError(`Invalid type: expected id=number, got a ${typeof id}`)
    }
    if (!(user instanceof User)) {
      throw new TypeError("Invalid type: user must be User");
    }
    if (typeof (passwordHash) != 'string' && typeof (passwordHash) != 'undefined') {
      throw new TypeError(`Invalid type: expected string, got a ${typeof passwordHash}`)
    }

    const dto = {
      username: user.getUserName(),
      first_name: user.getFirstName(),
      last_name: user.getLastName(),
      gender: user.getGender(),
      birthdate: user.getBirthdate(),
    };

    if (passwordHash) {
      dto.password = passwordHash;
    }

    return await this.update(id, dto);
  }

  async deleteUser(id) {
    if (typeof (id) != 'number') {
      throw new TypeError(`Invalid type: expected id=number, got a ${typeof id}`)
    }
    return await this.delete(id)
  }

}

function NewUserRepository(sequelize) {
  return new UserRepository(initUserModel(sequelize))
}

module.exports = { UserRepository, NewUserRepository };