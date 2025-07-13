const { BaseRepository } = require("../../pkg/database/base_repository");
const initUserModel = require("./model");
const { User } = require("./user");


class UserRepository extends BaseRepository {
  async createUser(user, passwordHash) {
    if (!(user instanceof User)) {
      throw new TypeError("Invalid type: user must be User");
    }

    if (typeof(passwordHash) != 'string') {
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
    if (typeof(id) != 'number') {
      throw new TypeError(`Invalid type: expected number, got a ${typeof id}`)
    }

    return await this.findById(id)
  }
  
  // Bad practic, can't check type options
  async findAllUsers(options) {
    return await this.findAll(options)
  }

  // Also can't check updates
  async updateUser(id, updates) {
    if (typeof(id) != 'number') {
      throw new TypeError(`Invalid type: expected id=number, got a ${typeof id}`)
    }
    

    return await this.update(id, updates);
  }

  async deleteUser(id) {
    return await this.delete(id)
  }

}

function NewUserRepository(sequelize) {
  return new UserRepository(initUserModel(sequelize))
}

module.exports = NewUserRepository;